class ZitElement extends HTMLElement {
  // This uses a negative lookahead to match an identifier
  // that is not immediately followed by a left parenthesis.
  static FIRST_CHAR = "a-zA-Z_$";
  static NOT_FIRST_CHAR = "a-zA-Z0-9_$";
  static COMMON_RE = `[${this.FIRST_CHAR}][${this.NOT_FIRST_CHAR}]*(?![${this.NOT_FIRST_CHAR}\\(])`;
  static IDENTIFIER_RE = new RegExp(this.COMMON_RE, "g");
  static ONLY_IDENTIFIER_RE = new RegExp(`${this.COMMON_RE}$`);

  static attributeTypeMap = new Map();
  static propertyToExpressionsMap = new Map();
  static template = document.createElement("template");

  static get observedAttributes() {
    const atm = this.attributeTypeMap;
    if (atm.size === 0 && this.hasOwnProperty("properties")) {
      for (const [name, type] of Object.entries(this.properties)) {
        atm.set(name, type);
      }
    }
    return [...atm.keys()];
  }

  expressionReferencesMap = new Map();
  propertyReferencesMap = new Map();

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  attributeChangedCallback(attrName, _, newValue) {
    // Update the corresponding property.
    this[attrName] = this.getTypedValue(attrName, newValue);
  }

  connectedCallback() {
    if (!ZitElement.template.innerHTML) {
      ZitElement.template.innerHTML = `
      <style>${this.constructor.css()}</style>
      ${this.constructor.html()}
      `;
    }

    this.shadowRoot.appendChild(ZitElement.template.content.cloneNode(true));
    this.wireEvents();
    this.makeReactive();
    this.setObservedProperties(); // must be called after makeReactive
    console.log(
      "zit-element: propertyReferencesMap =",
      this.propertyReferencesMap
    );
    console.log(
      "zit-element: propertyToExpressionsMap =",
      ZitElement.propertyToExpressionsMap
    );
    console.log(
      "zit-element: expressionReferencesMap =",
      this.expressionReferencesMap
    );
  }

  evaluateAttributes(element) {
    let shouldObserve = false;

    for (const attrName of element.getAttributeNames()) {
      const attrValue = element.getAttribute(attrName);

      if (attrValue.startsWith("$:")) {
        const expression = attrValue.slice(2).trim();
        this.registerExpression(expression, element, attrName);
      } else if (attrValue.startsWith("$")) {
        const propertyName = attrValue.slice(1).trim();
        if (ZitElement.ONLY_IDENTIFIER_RE.test(propertyName)) {
          this.registerPropertyReference(propertyName, element, attrName);
          shouldObserve = true;

          // Change the value of the attribute from a property reference
          // to the value of the referenced property.
          this.updateAttribute(element, attrName, this[propertyName]);
        }
      }
    }

    return shouldObserve;
  }

  static evaluateInContext(expression, context) {
    /*
    return Function(
      ...Object.keys(context),
      `return (${expression});`
    )(...Object.values(context));
    */
    return function () {
      return eval(expression);
    }.call(context);
  }

  evaluateText(element) {
    const text = element.textContent.trim();
    if (text.startsWith("$:")) {
      const expression = text.slice(2).trim();
      this.registerExpression(expression, element);
    } else if (text.startsWith("$")) {
      const propertyName = text.slice(1).trim();
      if (ZitElement.ONLY_IDENTIFIER_RE.test(propertyName)) {
        this.registerPropertyReference(propertyName, element);
      }
    }
  }

  getTypedAttribute(attrName) {
    return this.getTypedValue(attrName, this.getAttribute(attrName));
  }

  getTypedValue(attrName, stringValue) {
    const type = ZitElement.attributeTypeMap.get(attrName);
    if (type === "number") return Number(stringValue);
    if (type === "boolean") return Boolean(stringValue);
    return stringValue;
  }

  makeReactive() {
    const elements = this.shadowRoot.querySelectorAll("*");
    for (const element of elements) {
      this.evaluateText(element);
      const shouldObserve = this.evaluateAttributes(element);
      if (shouldObserve) this.observeAttributes(element);
    }
  }

  // Listens for attribute value changes and
  // update the corresponding property if it exists.
  observeAttributes(element) {
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === "attributes") {
          const { attributeName } = mutation;
          if (this.hasOwnProperty(attributeName)) {
            const oldValue = this[attributeName];
            const newValue = element.getAttribute(attributeName);
            if (newValue !== oldValue) this[attributeName] = newValue;
          }
        }
      }
    });
    observer.observe(element, { attributes: true });
  }

  static register() {
    const elementName = ZitElement.toKebabCase(this.name);
    if (!customElements.get(elementName)) {
      customElements.define(elementName, this);
    }
  }

  // Do not place untrusted expressions in
  // attribute values or the text content of elements!
  registerExpression(expression, element, attrName) {
    // Get all the identifiers in the expression.
    const identifiers = expression.match(ZitElement.IDENTIFIER_RE);

    for (const identifier of identifiers) {
      let expressions = ZitElement.propertyToExpressionsMap.get(identifier);
      if (!expressions) {
        expressions = [];
        ZitElement.propertyToExpressionsMap.set(identifier, expressions);
      }
      expressions.push(expression);
    }

    let references = this.expressionReferencesMap.get(expression);
    if (!references) {
      references = [];
      this.expressionReferencesMap.set(expression, references);
    }
    references.push(attrName ? { element, attrName } : element);

    const value = ZitElement.evaluateInContext(expression, this);
    if (attrName) {
      this.updateAttribute(element, attrName, value);
    } else {
      element.textContent = value;
    }
  }

  registerPropertyReference(propertyName, element, attrName) {
    // Copy the property value to a new property with a leading underscore.
    // The property is replaced below with Object.defineProperty.
    this["_" + propertyName] = this[propertyName];

    let references = this.propertyReferencesMap.get(propertyName);

    // We only want to do this once for each property,
    // not once for each element that uses the property.
    if (!references) {
      references = [];
      this.propertyReferencesMap.set(propertyName, references);

      Object.defineProperty(this, propertyName, {
        get() {
          return this["_" + propertyName];
        },
        set(value) {
          const oldValue = this["_" + propertyName];
          this["_" + propertyName] = value;

          // If the property name matches an attribute on the custom element,
          // update that attribute.
          if (this.hasAttribute(propertyName)) {
            const oldValue = this.getTypedAttribute(propertyName);
            if (value !== oldValue) this.setAttribute(propertyName, value);
          }

          // Update all the references to this property.
          for (const reference of references) {
            if (reference instanceof Element) {
              element.textContent = value;
            } else {
              const { element, attrName } = reference;
              // This is necessary for input, textarea, and select elements
              // to trigger the browser to display the new value.
              if (attrName === "value") element.value = value;
              this.updateAttribute(element, attrName, value);
            }
          }

          // Update all the elements whose text content
          // is an expression that uses this property.
          const expressions =
            ZitElement.propertyToExpressionsMap.get(propertyName) || [];
          for (const expression of expressions) {
            const value = ZitElement.evaluateInContext(expression, this);
            const references = this.expressionReferencesMap.get(expression);
            for (const reference of references) {
              if (reference instanceof Element) {
                reference.textContent = value;
              } else {
                const { element, attrName } = reference;
                this.updateAttribute(element, attrName, value);
              }
            }
          }
        },
      });
    }

    references.push(attrName ? { element, attrName } : element);

    const { localName } = element;
    if (localName === "input" || localName === "textarea") {
      element.addEventListener("input", (event) => {
        this[propertyName] = event.target.value;
      });
    } else if (localName === "select") {
      element.addEventListener("change", (event) => {
        this[propertyName] = event.target.value;
      });
    }
  }

  // Sets the corresponding property for each observed attribute.
  setObservedProperties() {
    for (const attrName of this.constructor.observedAttributes) {
      this[attrName] = this.getTypedAttribute(attrName);
    }
  }

  static toKebabCase = (str) =>
    str
      // Insert a dash before each uppercase letter
      // that is preceded by a lowercase letter or digit.
      .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
      .toLowerCase();

  updateAttribute(element, attrName, value) {
    const currentValue = element.getAttribute(attrName);
    if (typeof value === "boolean") {
      if (value) {
        if (currentValue !== attrName) {
          element.setAttribute(attrName, attrName);
        }
      } else {
        if (currentValue) element.removeAttribute(attrName);
      }
    } else if (currentValue !== value) {
      element.setAttribute(attrName, value);
    }
  }

  wireEvents() {
    const elements = this.shadowRoot.querySelectorAll("*");
    for (const element of elements) {
      for (const attr of element.attributes) {
        const { name } = attr;
        if (name.startsWith("on")) {
          const eventName = name.slice(2).toLowerCase();
          const methodName = attr.value;
          element.addEventListener(eventName, (event) =>
            this[methodName](event)
          );
          element.removeAttribute(name);
        }
      }
    }
  }
}

export default ZitElement;
