//TODO: Make this safer!
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
          this.registerPropertyReference(element, rest);
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

  registerExpression(element, expression) {
    const identifiers = expression.match(ZitElement.identifierRE);
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
  }

  registerPropertyReference(element, propertyName) {
    let elements = this.reactiveMap[propertyName];

    if (!elements) {
      elements = this.reactiveMap[propertyName] = [];
      Object.defineProperty(this, propertyName, {
        get() {
          return this["_" + propertyName];
        },
        set(value) {
          this["_" + propertyName] = value;

          const oldValue = this.getAttribute(propertyName);
          if (value !== oldValue) this.setAttribute(propertyName, value);

          // Update all the elements whose text content
          // is the value of this property.
          for (const element of elements) {
            element.textContent = value;
          }

          // Update all the elements whose text content
          // is an expression that uses this property.
          const expressions = ZitElement.propertyToExpressionsMap[propertyName];
          for (const expression of expressions) {
            const value = evalInContext(expression, this);
            const elements = this.expressionToElementsMap[expression];
            for (const element of elements) {
              element.textContent = value;
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
