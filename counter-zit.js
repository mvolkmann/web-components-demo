import ZitElement from "./zit-element.js";
//import ZitElement from "./zit-element.min.js";

class CounterZit extends ZitElement {
  static properties = {
    count: { type: "number", reflect: true },
  };

  // Omit this construct to run in "render" mode
  // where every property changes causes the component to re-render.
  // Include this constructor to run in "react" mode
  // where property changes trigger targeted text and attribute updates.
  constructor() {
    super(true);
  }

  zero = 0;
  nothing() {
    return 0;
  }

  css() {
    return /*css*/ `
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
    `;
  }

  html() {
    //TODO: Can an expression refer to global variables?
    //TODO: Can an expression call global functions?
    return /*html*/ `
      <div>
        <button disabled="$: this.count === 0" onclick="decrement">-</button>
        <!--
        <button disabled="$: this.count === this.zero" onclick="decrement">-</button>
        <button disabled="$: this.count === this.nothing()" onclick="decrement">-</button>
        -->
        <span>$count</span>
        <button onclick="increment">+</button>
        <!-- This span is only evaluates once in react mode. -->
        <span>${this.count >= 10 ? "double-digit" : ""}</span>
      </div>
    `;
  }

  decrement() {
    if (this.count > 0) this.count--;
  }

  increment() {
    this.count++;
  }

  zero() {
    return 0;
  }
}

CounterZit.register();
