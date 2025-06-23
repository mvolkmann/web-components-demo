function zit(strings, ...params) {
  console.log("zit-element.js zit: strings =", strings);
  console.log("zit-element.js zit: params =", params);
}

class ZitElement extends HTMLElement {
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
