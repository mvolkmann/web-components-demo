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
    if (this.count > 0) {
      this.count--;
      console.log("counter-no-shadow.js decrement: this.count =", this.count);
      if (this.count === 0) {
        console.log("counter-no-shadow.js decrement: disabled");
        this.decrementBtn.setAttribute("disabled", "disabled");
      } else {
        console.log("counter-no-shadow.js decrement: not zero");
      }
      this.update();
    }
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

  update() {
    this.span.textContent = this.count;
  }
}

customElements.define("counter-no-shadow", CounterNoShadow);
