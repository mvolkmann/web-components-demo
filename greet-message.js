export class GreetMessage extends HTMLElement {
  static get observedAttributes() {
    return ["name"];
  }

  connectedCallback() {
    //const name = this.getAttribute("name");
    //if (!name) throw new Error("name is a required attribute");

    // Approach #1
    // Using shadow DOM is not required.
    /*
    const div = document.createElement('div');
    div.textContent = `Hello, ${name}!`;
    div.style.color = 'purple';
    this.appendChild(div);
    */

    // Approach #2
    /*
    const div = document.createElement('div');
    div.textContent = `Hello, ${name}!`;
    div.style.color = 'purple';

    this.attachShadow({mode: 'open'});
    this.shadowRoot.appendChild(div);
    */

    // Approach #3
    this.attachShadow({ mode: "open" });
    this.render();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "name") this.render();
  }

  render() {
    const name = this.getAttribute("name");
    // Setting innerHTML removes the need to use low-level
    // DOM methods like `createElement` and `appendChild`.
    this.shadowRoot.innerHTML = `
      <div style="color: purple;">Hello, ${name}!</div>
    `;
  }
}

customElements.define("greet-message", GreetMessage);
