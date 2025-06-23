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
  static identifierRE = /[a-zA-Z_$][a-zA-Z0-9_$]*/;

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
        const value = element.getAttribute("value");
        if (value.startsWith("$")) {
          const rest = value.slice(1).trim();
          if (ZitElement.identifierRE.test(rest)) {
            const propertyName = rest;

            this.registerPropertyReference(element, propertyName);

            element.addEventListener("input", (event) => {
              this[propertyName] = event.target.value;
            });

            // Change the value of the "value" attribute
            // to the value of the referenced property.
            const value = this[propertyName];
            //TODO: Need to check for a value?
            if (value) element.setAttribute("value", value);
          }
        }
      }
    }
  }

  static register() {
    const elementName = toKebabCase(this.name);
    if (!customElements.get(elementName)) {
      customElements.define(elementName, this);
    }
  }

  // Do not place untrusted expressions the text content of elements!
  registerExpression(element, expression) {
    const re = ZitElement.identifierRE;
    const reGlobal = new RegExp(re.source, "g");
    const identifiers = expression.match(reGlobal);
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
        /*************  ✨ Windsurf Command ⭐  *************/
        /**
         * Gets the value of the property.
         *
         * We use the "_" prefix when storing the value
         * because the property is replaced below with Object.defineProperty.
         *
         * @returns {any} The value of the property.
         */
        /*******  b1a28131-f096-4645-808e-38975abbdaff  *******/
        get() {
          return this["_" + propertyName];
        },
        set(value) {
          this["_" + propertyName] = value;

          const oldValue = this.getAttribute(propertyName);
          if (value !== oldValue) {
            this.setAttribute(propertyName, value);
          }

          // Update all the elements whose text content
          // is the value of this property.
          for (const element of elements) {
            if (element.localName === "input") {
              element.setAttribute("value", value);
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
