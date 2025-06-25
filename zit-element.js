function evalInContext(expression, context) {
  return Function(
    ...Object.keys(context),
    `return (${expression});`
  )(...Object.values(context));
}

const toKebabCase = (str) =>
  str
    // Insert a dash before each uppercase letter
    // that is preceded by a lowercase letter or digit.
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .toLowerCase();

class ZitElement extends HTMLElement {
  static IDENTIFIER_RE = /[a-zA-Z_$][a-zA-Z0-9_$]*/g;
  static ONLY_IDENTIFIER_RE = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/;
  static propertyToExpressionsMap = {};

  expressionReferencesMap = {};
  propertyReferencesMap = {};

  attributeChangedCallback(name, oldValue, newValue) {
    /*
    console.log(
      `zit-element: ${name} attribute changed from ${oldValue} to ${newValue}`
    );
    */
    this[name] = newValue;
  }

  connectedCallback() {
    this.makeReactive();
    console.log("propertyReferencesMap =", this.propertyReferencesMap);
    console.log(
      "propertyToExpressionsMap =",
      ZitElement.propertyToExpressionsMap
    );
    console.log("expressionReferencesMap =", this.expressionReferencesMap);
    this.wireEvents();
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
          element.setAttribute(attrName, this[propertyName]);
        }
      }
    }

    return shouldObserve;
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
    const elementName = toKebabCase(this.name);
    if (!customElements.get(elementName)) {
      customElements.define(elementName, this);
    }
  }

  // Do not place untrusted expressions the text content of elements!
  registerExpression(expression, element, attrName) {
    // Get all the identifiers in the expression.
    const identifiers = expression.match(ZitElement.IDENTIFIER_RE);

    for (const identifier of identifiers) {
      let expressions = ZitElement.propertyToExpressionsMap[identifier];
      if (!expressions) {
        expressions = ZitElement.propertyToExpressionsMap[identifier] = [];
      }
      expressions.push(expression);
    }

    let references = this.expressionReferencesMap[expression];
    if (!references) references = this.expressionReferencesMap[expression] = [];
    references.push(attrName ? { element, attrName } : element);

    element.textContent = evalInContext(expression, this);
  }

  registerPropertyReference(propertyName, element, attrName) {
    // Copy the property value to a new property with a leading underscore.
    // The property is replaced below with Object.defineProperty.
    this["_" + propertyName] = this[propertyName];

    let references = this.propertyReferencesMap[propertyName];

    // We only want to do this once for each property,
    // not once for each element that uses the property.
    if (!references) {
      references = this.propertyReferencesMap[propertyName] = [];

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
            const oldAttr = this.getAttribute(propertyName);
            if (value !== oldAttr) this.setAttribute(propertyName, value);
          }

          // Update all the references to this property.
          for (const reference of references) {
            if (reference instanceof Element) {
              element.textContent = value;
            } else {
              const { element, attrName } = reference;
              element.value = value; // updates displayed value
              element.setAttribute(attrName, value); // updates attribute in DOM
            }
          }

          // Update all the elements whose text content
          // is an expression that uses this property.
          const expressions =
            ZitElement.propertyToExpressionsMap[propertyName] || [];
          for (const expression of expressions) {
            const value = evalInContext(expression, this);
            const references = this.expressionReferencesMap[expression];
            for (const reference of references) {
              if (reference instanceof Element) {
                reference.textContent = value;
              } else {
                const { element, attrName } = reference;
                element.setAttribute(attrName, value);
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
