import { dom } from "./dom-gen.js";
import ZitElement from "./zit-element.js";

const css = /*css*/ `
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
`;

const domGenDemoDOM = dom({
  $name: "div",
  $children: [
    {
      $name: "div",
      $children: [
        { $name: "label", for: "factor", $text: "Factor:" },
        {
          $name: "input",
          id: "factor",
          type: "number",
          min: 1,
          value: "$factor",
        },
      ],
    },
    {
      $name: "button",
      id: "decrement-btn",
      onClick: "decrement",
      $text: "-",
    },
    {
      $name: "span",
      $text: "$count",
    },
    {
      $name: "button",
      id: "increment-btn",
      onClick: "increment",
      $text: "+",
    },
  ],
});

class DomGenDemo extends ZitElement {
  static get observedAttributes() {
    return ["count", "factor"];
  }

  factor = 1;

  constructor() {
    super();
    const root = this.attachShadow({ mode: "open" });
    const style = document.createElement("style");
    style.textContent = css;
    root.appendChild(style);
    root.appendChild(domGenDemoDOM.cloneNode(true));
  }

  connectedCallback() {
    //TODO: Can you remove the need for the next line?
    super.connectedCallback();

    this.count = this.getAttribute("count") || 0;
    this.factor = this.getAttribute("factor") || 1;
  }

  decrement() {
    if (this.count > 0) this.count--;
  }

  increment() {
    this.count++;
  }
}

customElements.define("dom-gen-demo", DomGenDemo);
