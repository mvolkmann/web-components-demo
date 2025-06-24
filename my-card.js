class MyCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    const template = document.getElementById("my-card");
    // Passing true creates a deep clone.
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
}

customElements.define("my-card", MyCard);
