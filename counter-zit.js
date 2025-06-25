import ZitElement from "./zit-element.js";
//import ZitElement from "./zit-element.min.js";

class CounterZit extends ZitElement {
  static get observedAttributes() {
    return ["count"];
  }

  static observedAttributeTypes = {
    count: "number",
  };

  constructor() {
    super();

    const { template } = CounterZit;
    if (template.innerHTML) return;

    // The html comment preceding the template literal signals to the
    // es6-string-html extension that it should provide syntax highlighting.
    template.innerHTML = /*html*/ `
      <style>
        :not(:defined) {
          visibility: hidden;
        }

        .counter {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        button {
          background-color: lightgreen;
        }

        button:disabled {
          background-color: gray;
        }
      </style>
      <div>
        <button disabled="$: count === 0" onclick="decrement">-</button>
        <span>$count</span>
        <button onclick="increment">+</button>
      </div>
    `;
  }

  decrement() {
    if (this.count > 0) this.count--;
  }

  increment() {
    this.count++;
  }
}

CounterZit.register();
