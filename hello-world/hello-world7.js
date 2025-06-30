class HelloWorld7 extends HTMLElement {
  static template = document.createElement("template");
  static {
    this.template.innerHTML = /*html*/ `
      <p>Hello, <span id="name"></span>!</p>
    `;
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    const { shadowRoot } = this;
    shadowRoot.appendChild(HelloWorld7.template.content.cloneNode(true));
    const span = shadowRoot.querySelector("#name");
    span.textContent = this.getAttribute("name") || "World";
  }
}

customElements.define("hello-world7", HelloWorld7);
