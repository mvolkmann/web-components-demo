import {
  css,
  html,
  LitElement,
} from "https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js";

class CounterLit extends LitElement {
  static properties = {
    // Setting reflect to true keeps the count attribute
    // in sync with the count property.
    count: { type: Number, reflect: true },
  };

  static styles = css`
    button {
      display: inline-flex;
      justify-content: center;
      align-items: center;

      aspect-ratio: 1;
      border-radius: 50%;
      color: white;
      font-size: inherit;
      height: 2.5rem;
    }

    #decrement-btn {
      background-color: red;
    }

    #increment-btn {
      background-color: green;
    }

    div {
      font-size: 2rem;
    }
  `;

  constructor() {
    super();
    this.count = 0;
  }

  decrement() {
    if (this.count > 0) this.count--;
  }

  increment() {
    this.count++;
  }

  render() {
    return html`
      <div>
        <button id="decrement-btn" @click=${this.decrement}>-</button>
        <span>${this.count}</span>
        <button id="increment-btn" @click=${this.increment}>+</button>
      </div>
    `;
  }
}

customElements.define("counter-lit", CounterLit);
