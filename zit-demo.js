const zitDemoTemplate = document.createElement("template");
zitDemoTemplate.innerHTML = /*html*/ `
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
    <button id="decrement-btn" onClick="decrement">-</button>
    <span>$count</span>
    <button id="increment-btn" onClick="increment">+</button>
  </div>
`;
class ZitDemo extends ZitElement {
  static get observedAttributes() {
    return ["count"];
  }

  constructor() {
    super();
    const root = this.attachShadow({ mode: "open" });
    root.appendChild(zitDemoTemplate.content.cloneNode(true));
  }

  connectedCallback() {
    super.connectedCallback();
    this.count = this.getAttribute("count") || 0;
  }

  decrement() {
    if (this.count > 0) this.count--;
  }

  increment() {
    this.count++;
  }
}

customElements.define("zit-demo", ZitDemo);
