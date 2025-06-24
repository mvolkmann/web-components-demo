class MyCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    const template = document.getElementById("my-card");
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
}

customElements.define("my-card", MyCard);
