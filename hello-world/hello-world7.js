// When script tag uses type="module", this variable is scoped to the module.
const template = document.createElement("template");
template.innerHTML = /*html*/ `
  <p>Hello, <span id="name"></span>!</p>
`;

class HelloWorld7 extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    const { shadowRoot } = this;
    shadowRoot.appendChild(template.content.cloneNode(true));
    const span = shadowRoot.querySelector("#name");
    span.textContent = this.getAttribute("name") || "World";
  }
}

customElements.define("hello-world7", HelloWorld7);
