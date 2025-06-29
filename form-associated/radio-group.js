class RadioGroup extends HTMLElement {
  static formAssociated = true;
  #defaultOption;
  #internals;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.#internals = this.attachInternals();
  }

  connectedCallback() {
    const name = this.getAttribute("name");
    const options = this.getAttribute("options")
      .split(",")
      .map((label) => label.trim());
    const defaultOption = this.getAttribute("default") || options[0];
    this.#defaultOption = defaultOption;

    const parent = document.createElement("div");
    parent.classList.add("radio-group");

    let input;
    for (const option of options) {
      const div = document.createElement("div");

      input = document.createElement("input");
      input.setAttribute("type", "radio");
      input.setAttribute("id", option);
      input.setAttribute("name", name);
      input.setAttribute("value", option);
      if (option === defaultOption) {
        input.setAttribute("checked", "checked");
      }
      div.appendChild(input);

      this.#updateFormValue(defaultOption); // initial value
      input.addEventListener("change", (event) => {
        this.#updateFormValue(event.target.value);
      });

      const label = document.createElement("label");
      label.setAttribute("for", option);
      label.textContent = option;
      div.appendChild(label);

      parent.appendChild(div);
    }

    this.shadowRoot.innerHTML = `
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
    `;

    this.shadowRoot.appendChild(parent);
  }

  formResetCallback() {
    this.#updateFormValue(this.#defaultOption);
    for (const input of this.shadowRoot.querySelectorAll("input")) {
      input.checked = input.value === this.#defaultOption;
    }
  }

  #updateFormValue(value) {
    // Optionally validate the value.
    this.#internals.setFormValue(value);
  }
}

customElements.define("radio-group", RadioGroup);
