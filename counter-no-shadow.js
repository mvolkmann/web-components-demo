const counterTemplate = document.createElement("template");
counterTemplate.innerHTML = /*html*/ `
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
    <button id="decrement-btn">-</button>
    <span>${this.count}</span>
    <button id="increment-btn">+</button>
  </div>
`;

class CounterNoShadow extends HTMLElement {
  static get observedAttributes() {
    return ["count"];
  }

  constructor() {
    super();
    // Optional things to do in the constructor:
    // - attach a shadow root; ex. this.attachShadow({ mode: "open" }
    // - initialize properties with code
    // - create elements here instead of in connectedCallback
    //   to avoid recreating them every time the element is connected,
    //   but append them in connectedCallback
    // - bind methods; ex. this.increment = this.increment.bind(this)
    //
    // Things to avoid in the constructor:
    // - manipulate the DOM
    // - access attributes or child elements
  }

  attributeChangedCallback(name, oldValue, newValue) {
    console.log(
      `counter-no-shadow: ${name} attribute changed from ${oldValue} to ${newValue}`
    );
    console.log(
      "counter-no-shadow.js attributeChangedCallback: this.isConnected =",
      this.isConnected
    );
    if (this.isConnected) this.update();
  }

  connectedCallback() {
    // This cannot be done in the constructor.
    this.appendChild(counterTemplate.content.cloneNode(true));

    this.querySelector("#decrement-btn").addEventListener("click", () => {
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

customElements.define("counter-no-shadow", CounterNoShadow);
