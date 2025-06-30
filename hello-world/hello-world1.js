class HelloWorld1 extends HTMLElement {
  connectedCallback() {
    const name = this.getAttribute("name") || "World";
    this.innerHTML = `<p>Hello, ${name}!</p>`;
  }
}

customElements.define("hello-world1", HelloWorld1);
