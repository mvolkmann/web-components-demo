import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("radio-group-lit")
export class RadioGroupLit extends LitElement {
  static styles = css`
    :not(:defined) {
      visibility: hidden;
    }

    .radio-group {
      display: flex;
      gap: 0.5rem;

      > div {
        display: flex;
        align-items: center;
      }
    }
  `;

  @property({ type: String }) name = "";
  @property({ type: String }) options = "";
  @property({ type: String }) default = "";

  render() {
    const options = this.options.split(",").map((label) => label.trim());
    console.log("radio-group-lit.ts render: options =", options);
    return html`
      <div class="radio-group">
        ${options.map((option) => this.#makeRadio(option)).join("")}
      </div>
    `;
  }

  #makeRadio(option) {
    return html`
      <div>
        <input
          type="radio"
          id="${option}"
          name="${this.name}"
          value="${option}"
          ?checked=${option === this.default}
        />
        <label for="${option}">${option}</label>
      </div>
    `;
  }
}
