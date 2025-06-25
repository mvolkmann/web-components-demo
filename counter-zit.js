import ZitElement from "./zit-element.js";

const counterZitTemplate = document.createElement("template");
counterZitTemplate.innerHTML = /*html*/ `
  <style>
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
    <button onclick="decrement">-</button>
    <span>$count</span>
    <button onclick="increment">+</button>
  </div>
`;
//<button disabled="$: count === 0" onclick="decrement">-</button>

class CounterZit extends ZitElement {
  static get observedAttributes() {
    return ["count"];
  }

  constructor() {
    super();
    const root = this.attachShadow({ mode: "open" });
    root.appendChild(counterZitTemplate.content.cloneNode(true));
  }

  connectedCallback() {
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
