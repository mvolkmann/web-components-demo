class CounterShadowOpen extends HTMLElement {
  static get observedAttributes() {
    return ["count"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  attributeChangedCallback() {
    if (this.isConnected) this.update();
  }

  connectedCallback() {
    const root = this.shadowRoot;
    root.appendChild(CounterNoShadow.template.content.cloneNode(true));

    this.decrementBtn = root.querySelector("#decrement-btn");
    this.decrementBtn.addEventListener("click", () => {
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
    if (this.count === 0) return;

    this.count--;
    // this.count gets converted to a string,
    // so we have to use == instead of === on the next line.
    if (this.count == 0) {
      this.decrementBtn.setAttribute("disabled", "disabled");
    }
    this.update();
  }

  increment() {
    this.count++;
    this.decrementBtn.removeAttribute("disabled");
    this.update();
  }

  update() {
    if (this.span) this.span.textContent = this.count;
  }
}

customElements.define("counter-shadow-open", CounterShadowOpen);
