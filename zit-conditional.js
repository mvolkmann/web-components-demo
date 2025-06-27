import ZitElement from "./zit-element.js";

class ZitConditional extends ZitElement {
  static properties = {
    count: { type: "number", value: 0 },
  };

  css() {
    return /*css*/ `
      :not(:defined) {
        visibility: hidden;
      }
    `;
  }

  html() {
    return /*html*/ `
      <div>
        <button onclick="increment">${this.count}</button>
        <span>${this.count % 2 === 0 ? "even" : "odd"}</span>
      </div>
    `;
  }

  increment() {
    this.count++;
  }
}

ZitConditional.register();
