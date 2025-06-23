class ZitElement extends HTMLElement {
  reactiveMap = {};

  attributeChangedCallback(name, oldValue, newValue) {
    console.log(
      `zit-element: ${name} attribute changed from ${oldValue} to ${newValue}`
    );
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
      if (text.startsWith("$")) {
        const propertyName = text.slice(1);
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

              for (const element of elements) {
                element.textContent = value;
              }
            },
          });
        }

        elements.push(element);
      }
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
