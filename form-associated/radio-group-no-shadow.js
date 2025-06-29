class RadioGroupNoShadow extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const name = this.getAttribute("name");
    const options = this.getAttribute("options")
      .split(",")
      .map((label) => label.trim());
    const defaultOption = this.getAttribute("default") || options[0];

    const parent = document.createElement("div");
    parent.classList.add("radio-group");

    for (const option of options) {
      const div = document.createElement("div");

      const input = document.createElement("input");
      input.setAttribute("type", "radio");
      input.setAttribute("id", option);
      input.setAttribute("name", name);
      input.setAttribute("value", option);
      if (option === defaultOption) {
        input.setAttribute("checked", "checked");
      }
      div.appendChild(input);

      const label = document.createElement("label");
      label.setAttribute("for", option);
      label.textContent = option;
      div.appendChild(label);

      parent.appendChild(div);
    }

    this.innerHTML = `
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
    this.appendChild(parent);
  }
}

customElements.define("radio-group-no-shadow", RadioGroupNoShadow);
