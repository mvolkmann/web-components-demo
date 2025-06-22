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

  /* Since we don't need to do anything in this constructor, it can be omitted. 
  constructor() {
    super();
  }
  */

  decrement() {
    if (this.count > 0) this.count--;
  }

  render() {
    return html`
      <div>
        <!-- Event handler code can be placed inline.
        <button
          id="decrement-btn"
          @click=${() => {
          if (this.count > 0) this.count--;
        }}
        >-</button>
        -->
        <button id="decrement-btn" @click=${this.decrement}>-</button>
        <span>${this.count}</span>
        <button id="increment-btn" @click=${() => this.count++}>+</button>
      </div>
    `;
  }
}

customElements.define("counter-lit", CounterLit);
