import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("radio-group-lit")
export class RadioGroupLit extends LitElement {
  static formAssociated = true;
  _internals;

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

  constructor() {
    super();
    this._internals = this.attachInternals();
  }

  handleChange(event) {
    this._internals.setFormValue(event.target.value);
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
          @change=${this.handleChange}
        />
        <label for="${option}">${option}</label>
      </div>
    `;
  }

  render() {
    const options = this.options.split(",").map((label) => label.trim());
    if (!this.default) this.default = options[0];
    return html`
      <div class="radio-group">
        ${options.map((option) => this.#makeRadio(option))}
      </div>
    `;
  }
}
