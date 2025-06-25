import ZitElement from "./zit-element.js";

const counterZitTemplate = document.createElement("template");
// The html comment preceding the template literal signals to the
// es6-string-html extension that it should provide syntax highlighting.
counterZitTemplate.innerHTML = /*html*/ `
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

class CounterZit extends ZitElement {
  static get observedAttributes() {
    return ["count"];
  }

  static observedAttributeTypes = {
    count: "number",
  };

  connectedCallback() {
    this.shadowRoot.appendChild(counterZitTemplate.content.cloneNode(true));
    super.connectedCallback();
    this.count = this.getAttribute("count") || 0;
  }

  decrement() {
    if (this.count > 0) this.count--;
  }

  increment() {
    this.count++;
  }
}

CounterZit.register();
