class RadioGroupNoShadow extends HTMLElement {
  #defaultOption;
  #name;

  connectedCallback() {
    this.#name = this.getAttribute("name");
    const options = this.getAttribute("options")
      .split(",")
      .map((label) => label.trim());
    this.#defaultOption = this.getAttribute("default") || options[0];

    this.innerHTML = /*html*/ `
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
}

customElements.define("radio-group-no-shadow", RadioGroupNoShadow);
