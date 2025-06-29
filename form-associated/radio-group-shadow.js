class RadioGroupShadow extends HTMLElement {
  static formAssociated = true;
  #defaultOption;
  #internals;
  #name;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.#internals = this.attachInternals();
  }

  connectedCallback() {
    this.#name = this.getAttribute("name");
    const options = this.getAttribute("options")
      .split(",")
      .map((label) => label.trim());
    this.#defaultOption = this.getAttribute("default") || options[0];
    this.#updateFormValue(this.#defaultOption); // initial value

    this.shadowRoot.innerHTML = /*html*/ `
      <style>
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
      </style>
      <div class="radio-group">
        ${options.map((option) => this.#makeRadio(option)).join("")}
      </div>
    `;

    const inputs = this.shadowRoot.querySelectorAll("input");
    for (const input of inputs) {
      input.addEventListener("change", (event) => {
        this.#updateFormValue(event.target.value);
      });
    }
  }

  formResetCallback() {
    this.#updateFormValue(this.#defaultOption);
    for (const input of this.shadowRoot.querySelectorAll("input")) {
      input.checked = input.value === this.#defaultOption;
    }
  }

  #makeRadio(option) {
    return /*html*/ `
      <div>
        <input
          type="radio"
          id="${option}"
          name="${this.#name}"
          value="${option}"
          ${option === this.#defaultOption ? "checked" : ""}
        />
        <label for="${option}">${option}</label>
      </div>
    `;
  }

  #updateFormValue(value) {
    // Optionally validate the value.
    this.#internals.setFormValue(value);
  }
}

customElements.define("radio-group-shadow", RadioGroupShadow);
