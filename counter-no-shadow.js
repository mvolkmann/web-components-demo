class CounterNoShadow extends HTMLElement {
  static template;

  static get observedAttributes() {
    return ["count"];
  }

  constructor() {
    super();
    CounterNoShadow.template = document.createElement("template");
  }
  attributeChangedCallback(name, oldValue, newValue) {
    if (this.isConnected) this.update();
  }

  connectedCallback() {
    const { template } = CounterNoShadow;
    template.innerHTML = /*html*/ `
      <style>
        :not(:defined) {
          visibility: hidden;
        }

        .counter {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        button {
          background-color: lightgreen;
        }

        button:disabled {
          background-color: gray;
        }
      </style>
      <div>
        <button id="decrement-btn">-</button>
        <span part="count">${this.count}</span>
        <button id="increment-btn">+</button>
      </div>
    `;

    this.appendChild(template.content.cloneNode(true));

    this.decrementBtn = this.querySelector("#decrement-btn");
    this.decrementBtn.addEventListener("click", () => {
      this.decrement();
    });
    this.querySelector("#increment-btn").addEventListener("click", () => {
      this.increment();
    });

    this.span = this.querySelector("span");
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

  handleEvent(event) {
    console.log("counter-no-shadow.js handleEvent: event =", event);
    if (event.type === "click") {
      const { id } = event.target;
      const methodName = id.split("-")[0];
      this[methodName]();
    }
  }

  /*************  ✨ Windsurf Command ⭐  *************/
  /**
   * Update the displayed count in the component.
   *
   * @protected
   */
  /*******  e78b5400-da8b-4ac1-9d45-aa71f479ae37  *******/
  update() {
    this.span.textContent = this.count;
  }
}

customElements.define("counter-no-shadow", CounterNoShadow);
