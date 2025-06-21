class CounterShadowOpen extends HTMLElement {
  static get observedAttributes() {
    return ["count"];
  }

  constructor() {
    super();
    const root = this.attachShadow({ mode: "open" });
    root.appendChild(counterTemplate.content.cloneNode(true));
  }

  attributeChangedCallback(name, oldValue, newValue) {
    console.log(
      `counter-shadow-open: ${name} attribute changed from ${oldValue} to ${newValue}`
    );
    if (this.isConnected) this.update();
  }

  connectedCallback() {
    const root = this.shadowRoot;
    root.querySelector("#decrement-btn").addEventListener("click", () => {
      this.decrement();
    });
    root.querySelector("#increment-btn").addEventListener("click", () => {
      this.increment();
    });

    this.span = root.querySelector("span");
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

customElements.define("counter-shadow-open", CounterShadowOpen);
