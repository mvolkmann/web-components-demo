import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("radio-group-lit")
export class RadioGroupLit extends LitElement {
  static formAssociated = true;
  #internals;
  #options;

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

  @property({ type: String }) name = ""; // used in form submission
  @property({ type: String }) options = ""; // comma-separated list
  // This is the reset value and
  // the initial value if the "value" attribute is not specified.
  @property({ type: String }) default = "";
  @property({ type: String }) value = ""; // current value

  constructor() {
    super();
    this.#internals = this.attachInternals();
  }

  connectedCallback() {
    super.connectedCallback();
    this.#options = this.options.split(",").map((label) => label.trim());
    if (!this.default) this.default = this.#options[0];
    if (!this.value) this.value = this.default;
  }

  formResetCallback() {
    this.value = this.default;
  }

  // This is called when a radio button or its label is clicked.
  handleChange(event) {
    this.value = event.target.value;
  }

  #makeRadio(option) {
    return html`
      <div>
        <input
          type="radio"
          id="${option}"
          name="${this.name}"
          value="${option}"
          .checked=${option === this.value}
          @change=${this.handleChange}
        />
        <!-- Note the "." before "checked", not "?", in order to
             update the "checked" property of the input element
             and not just the checked attribute. -->
        <label for="${option}">${option}</label>
      </div>
    `;
  }

  // This called automatically initially and
  // whenever a property value changes (such as "value").
  render() {
    return html`
      <div class="radio-group">
        ${this.#options.map((option) => this.#makeRadio(option))}
      </div>
    `;
  }

  // This is called automatically after every DOM update,
  // such as those triggered by the render method.
  updated() {
    // Keep the form value in sync with the "value" property.
    this.#internals.setFormValue(this.value);
  }
}
