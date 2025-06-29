import ZitElement from "./zit-element.js";

const zitDemoTemplate = document.createElement("template");
zitDemoTemplate.innerHTML = /*html*/ `
  <style>
    :not(:defined) {
      visibility: hidden;
    }

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

    label {
      //color: inherit;
      color: var(--zit-demo-label-color, purple);
    }
  </style>
  <div>
    <div>
      <label for="factor">Factor:</label>
      <input id="factor" type="number" min="1" value="$factor" />
    </div>
    <button id="decrement-btn" onClick="decrement">-</button>
    <span>$count</span>
    <button id="increment-btn" onClick="increment">+</button>
    <span id="factored">$: count * factor</span>
    <!--div>$: alert('hacked')</div-->
  </div>
`;
class ZitDemo extends ZitElement {
  //TODO: Can you remove the need for this?
  static get observedAttributes() {
    return ["count", "factor"];
  }

  factor = 1;

  constructor() {
    super();
    const root = this.attachShadow({ mode: "open" });
    root.appendChild(zitDemoTemplate.content.cloneNode(true));
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

ZitDemo.register();
