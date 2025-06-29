// This demonstrates that creating custom elements without a shadow DOM
// makes it much easier to support using instances inside a form.
// Compare this to radio-group-shadow.js and radio-group-lit.ts.
class RadioGroupNoShadow extends HTMLElement {
  #name;
  #value;

  connectedCallback() {
    this.#name = this.getAttribute("name");
    const options = this.getAttribute("options")
      .split(",")
      .map((option) => option.trim());
    this.#value =
      this.getAttribute("value") || this.getAttribute("default") || options[0];

    this.innerHTML = /*html*/ `
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
  }

  #makeRadio(option) {
    return /*html*/ `
      <div>
        <input
          type="radio"
          id="${option}"
          name="${this.#name}"
          value="${option}"
          ${option === this.#value ? "checked" : ""}
        />
        <label for="${option}">${option}</label>
      </div>
    `;
  }
}

customElements.define("radio-group-no-shadow", RadioGroupNoShadow);
