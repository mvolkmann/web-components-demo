class HelloWorld2 extends HTMLElement {
  connectedCallback() {
    const name = this.getAttribute("name") || "World";
    const p = document.createElement("p");
    p.textContent = `Hello, ${name}!`;
    this.appendChild(p);
  }
}

customElements.define("hello-world2", HelloWorld2);
