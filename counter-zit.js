import ZitElement from "./zit-element.js";
//import ZitElement from "./zit-element.min.js";

class CounterZit extends ZitElement {
  static properties = {
    // If react and render are both true, react is ignored.
    count: { type: "number", react: true, reflect: true, render: false },
    //count: { type: "number", react: false, reflect: true, render: true },
  };

  zero = 0;
  nothing() {
    return 0;
  }

  static css() {
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

  static html() {
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
