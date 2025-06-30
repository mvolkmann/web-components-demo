class HelloWorld4 extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    const name = this.getAttribute("name") || "World";
    const p = document.createElement("p");
    p.textContent = `Hello, ${name}!`;
    this.shadowRoot.appendChild(p);
  }
}

customElements.define("hello-world4", HelloWorld4);
