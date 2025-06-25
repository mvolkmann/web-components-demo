class CounterShadowClosed extends HTMLElement {
  static get observedAttributes() {
    return ["count"];
  }

  constructor() {
    super();
    // When the mode is "closed", there is no shadowRoot property.
    // This prevents access to the DOM of this component from outside.
    // To access the DOM from inside this component,
    // we must capture the return value of the attachShadow method.
    this.root = this.attachShadow({ mode: "closed" });
  }

  attributeChangedCallback(name, oldValue, newValue) {
    console.log(
      `counter-shadow-open: ${name} attribute changed from ${oldValue} to ${newValue}`
    );
    if (this.isConnected) this.update();
  }

  connectedCallback() {
    this.root.appendChild(counterTemplate.content.cloneNode(true));
    this.root.querySelector("#decrement-btn").addEventListener("click", () => {
      this.decrement();
    });
    this.root.querySelector("#increment-btn").addEventListener("click", () => {
      this.increment();
    });

    this.span = this.root.querySelector("span");
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

customElements.define("counter-shadow-closed", CounterShadowClosed);
