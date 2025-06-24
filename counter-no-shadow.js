const counterTemplate = document.createElement("template");
counterTemplate.innerHTML = /*html*/ `
  <style>
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
    <span>${this.count}</span>
    <button id="increment-btn">+</button>
  </div>
`;

class CounterNoShadow extends HTMLElement {
  static get observedAttributes() {
    return ["count"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (this.isConnected) this.update();
  }

  connectedCallback() {
    this.appendChild(counterTemplate.content.cloneNode(true));

    // This is a more direct approach to event handling
    // that does not require the handleEvent method.
    // this.querySelector("#decrement-btn").addEventListener("click", () => {
    //   this.decrement();
    // });
    // this.querySelector("#increment-btn").addEventListener("click", () => {
    //   this.increment();
    // });

    // This is an alternate approach to event handling
    // that causes the handleEvent method to be called.
    this.querySelector("#decrement-btn").addEventListener("click", this);
    this.querySelector("#increment-btn").addEventListener("click", this);

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
    if (this.count > 0) {
      this.count--;
      this.update();
    }
  }

  increment() {
    this.count++;
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

  update() {
    this.span.textContent = this.count;
  }
}

customElements.define("counter-no-shadow", CounterNoShadow);
