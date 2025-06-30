class RadioGroupShadow extends HTMLElement {
  static formAssociated = true;
  #default;
  #internals;
  #name;
  #value;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.#internals = this.attachInternals();
  }

  connectedCallback() {
    this.#name = this.getAttribute("name");
    const options = this.getAttribute("options")
      .split(",")
      .map((option) => option.trim());
    this.#default = this.getAttribute("default") || options[0];
    this.value = this.getAttribute("value") || this.#default;

    this.shadowRoot.innerHTML = /*html*/ `
      <style>
        :not(:defined) {
          visibility: hidden;
        }

        .radio-group {
          display: flex;
          gap: 0.25rem;

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

    // Add event listeners to the radio buttons.
    const inputs = this.shadowRoot.querySelectorAll("input");
    for (const input of inputs) {
      input.addEventListener("change", (event) => {
        this.value = event.target.value;
      });
    }
  }

  formResetCallback() {
    const value = (this.value = this.#default);
    for (const input of this.shadowRoot.querySelectorAll("input")) {
      input.checked = input.value === value;
    }
  }

  handleChange(event) {
    this.value = event.target.value;
  }

  #makeRadio(option) {
    return /*html*/ `
      <div>
        <input
          type="radio"
          id="${option}"
          name="${this.#name}"
          value="${option}"
          ${option === this.value ? "checked" : ""}
        />
        <label for="${option}">${option}</label>
      </div>
    `;
  }

  get value() {
    return this.#value;
  }

  set value(newValue) {
    this.#value = newValue;
    //this.#internals.setFormValue(newValue);
    // This demonstrates how a web component
    // can contribute multiple values to a form.
    const data = new FormData();
    data.append(this.#name, newValue);
    data.append("favoriteNumber", 19);
    this.#internals.setFormValue(data);
  }
}

customElements.define("radio-group-shadow", RadioGroupShadow);
