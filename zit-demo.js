const zitDemoTemplate = document.createElement("template");
zitDemoTemplate.innerHTML = /*html*/ `
  <style>
    button {
      display: inline-flex;
      justify-content: center;
      align-items: center;

      aspect-ratio: 1;
      border-radius: 50%;
      color: white;
      font-size: inherit;
      height: 2.5rem;
    }

    #decrement-btn {
      background-color: red;
    }

    #increment-btn {
      background-color: green;
    }

    div {
      font-size: 2rem;
    }
  </style>
  <div>
    <button id="decrement-btn" onClick="decrement">-</button>
    <span>${this.count}</span>
    <button id="increment-btn" onClick="increment">+</button>
  </div>
`;
class ZitDemo extends ZitElement {
  static get observedAttributes() {
    return ["count"];
  }

  constructor() {
    super();
    const root = this.attachShadow({ mode: "open" });
    root.appendChild(zitDemoTemplate.content.cloneNode(true));
  }

  attributeChangedCallback(name, oldValue, newValue) {
    console.log(
      `counter-shadow-open: ${name} attribute changed from ${oldValue} to ${newValue}`
    );
    if (this.isConnected) this.update();
  }

  connectedCallback() {
    super.connectedCallback();
    this.span = this.shadowRoot.querySelector("span");
    this.update();
  }

  // Treat the count attribute as the source of truth
  // rather than adding a property.
  get count() {
    return this.getAttribute("count") || 0;
  }

  set count(newCount) {
    return this.setAttribute("count", newCount);
  }

  decrement() {
    if (this.count > 0) {
      this.count--;
      this.update();
    }
  }

  increment() {
    this.count++;
    this.update();
  }

  update() {
    this.span.textContent = this.count;
  }
}

customElements.define("zit-demo", ZitDemo);
