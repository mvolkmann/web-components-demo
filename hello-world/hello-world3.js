class HelloWorld3 extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    const name = this.getAttribute("name") || "World";
    this.shadowRoot.innerHTML = `<p>Hello, ${name}!</p>`;
  }
}

customElements.define("hello-world3", HelloWorld3);
