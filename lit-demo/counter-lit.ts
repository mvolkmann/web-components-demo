import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("counter-lit")
export class CounterLit extends LitElement {
  static styles = css`
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

  @property({ type: Number }) count = 0;

  private decrement() {
    if (this.count > 0) this.count--;
  }

  private increment() {
    this.count++;
  }

  render() {
    return html`
      <div class="counter">
        <button ?disabled=${this.count === 0} @click=${this.decrement}>
          −
        </button>
        <span>${this.count}</span>
        <button @click=${this.increment}>+</button>
      </div>
    `;
  }
}
