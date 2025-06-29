// This code would be simplified a bit if the TypeScript decorator syntax
// was used, but that requires a build process.
import {
  css,
  html,
  LitElement,
} from "https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js";

class CounterLit extends LitElement {
  static styles = css`
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
  `;

  static properties = {
    // Setting reflect to true keeps the count attribute
    // in sync with the count property.
    count: { type: Number, reflect: true },
  };

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
        <button
          id="decrement-btn"
          ?disabled=${this.count === 0}
          @click=${this.decrement}
        >
          -
        </button>
        <span>${this.count}</span>
        <button id="increment-btn" @click=${() => this.count++}>+</button>
      </div>
    `;
  }
}

customElements.define("counter-lit", CounterLit);
