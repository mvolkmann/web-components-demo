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
  static propertyToExpressionsMap = {};
  static identifierRE = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/;
  static identifiersRE = /[a-zA-Z_$][a-zA-Z0-9_$]*/g;

  expressionToElementsMap = {};
  reactiveMap = {};

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
    this.wireEvents();
  }

  makeReactive() {
    const elements = this.shadowRoot.querySelectorAll("*");
    for (const element of elements) {
      const text = element.textContent.trim();
      if (text.startsWith("$:")) {
        this.registerExpression(element, text.slice(2).trim());
      } else if (text.startsWith("$")) {
        const rest = text.slice(1).trim();
        if (ZitElement.identifierRE.test(rest)) {
          const propertyName = rest;
          this.registerPropertyReference(element, propertyName);
        }
      }

      if (element.localName === "input") {
        this.makeInputReactive(element);
      }
    }
  }

  makeInputReactive(input) {
    const value = input.getAttribute("value");
    if (!value.startsWith("$")) return;

    const rest = value.slice(1).trim();
    // If that value after the $ is not a valid identifier, bail out.
    if (!ZitElement.identifierRE.test(rest)) return;

    const propertyName = rest;

    this.registerPropertyReference(input, propertyName);

    input.addEventListener("input", (event) => {
      this[propertyName] = event.target.value;
    });

    // If the input "value" attribute is modified,
    // update the value of the referenced property.
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === "attributes") {
          if (mutation.attributeName === "value") {
            const oldValue = this[propertyName];
            const newValue = input.getAttribute("value");
            if (newValue !== oldValue) this[propertyName] = newValue;
          }
        }
      }
    });
    observer.observe(input, {
      attributes: true,
      attributeFilter: ["value"],
    });

    // Change the value of the "value" attribute from a property reference
    // to the value of the referenced property.
    input.setAttribute("value", this[propertyName]);
  }

  static register() {
    const elementName = toKebabCase(this.name);
    if (!customElements.get(elementName)) {
      customElements.define(elementName, this);
    }
  }

  // Do not place untrusted expressions the text content of elements!
  registerExpression(element, expression) {
    const identifiers = expression.match(ZitElement.identifiersRE);
    for (const identifier of identifiers) {
      let expressions = ZitElement.propertyToExpressionsMap[identifier];
      if (!expressions) {
        expressions = ZitElement.propertyToExpressionsMap[identifier] = [];
      }
      expressions.push(expression);

      let elements = this.expressionToElementsMap[expression];
      if (!elements) elements = this.expressionToElementsMap[expression] = [];
      elements.push(element);
    }

    setTimeout(() => {
      element.textContent = evalInContext(expression, this);
    }, 1000);
  }

  registerPropertyReference(element, propertyName) {
    // Copy the property value to
    // a new property with a leading underscore
    // because the property is replaced below with Object.defineProperty.
    this["_" + propertyName] = this[propertyName];

    let elements = this.reactiveMap[propertyName];

    // We only want to do this once for each property,
    // not once for each element that uses the property.
    if (!elements) {
      elements = this.reactiveMap[propertyName] = [];

      Object.defineProperty(this, propertyName, {
        get() {
          return this["_" + propertyName];
        },
        set(value) {
          const oldValue = this["_" + propertyName];
          this["_" + propertyName] = value;

          if (this.hasAttribute(propertyName)) {
            const oldAttr = this.getAttribute(propertyName);
            if (value !== oldAttr) this.setAttribute(propertyName, value);
          }

          // Update all the elements whose text content
          // is the value of this property.
          for (const element of elements) {
            if (element.localName === "input") {
              // We need both of these!
              element.value = value; // updates displayed value
              element.setAttribute("value", value); // updates attribute in DOM
            } else {
              element.textContent = value;
            }
          }

          // Update all the elements whose text content
          // is an expression that uses this property.
          const expressions = ZitElement.propertyToExpressionsMap[propertyName];
          for (const expression of expressions) {
            const value = evalInContext(expression, this);
            const elements = this.expressionToElementsMap[expression];
            for (const element of elements) {
              if (element.localName === "input") {
                element.setAttribute("value", value);
              } else {
                element.textContent = value;
              }
            }
          }
        },
      });
    }

    elements.push(element);
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
