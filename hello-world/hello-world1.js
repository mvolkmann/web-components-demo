class HelloWorld1 extends HTMLElement {
  static get observedAttributes() {
    return ["name"];
  }

  connectedCallback() {
    const name = this.getAttribute("name") || "World";
    this.innerHTML = `<p>Hello, ${name}!</p>`;
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "name") {
      const p = this.querySelector("p");
      if (p) p.textContent = `Hello, ${newValue}!`;
    }
  }
}

customElements.define("hello-world1", HelloWorld1);
