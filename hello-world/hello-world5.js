import { html, LitElement } from "lit";

class HelloWorld5 extends LitElement {
  static properties = { name: { type: String } };

  render() {
    return html`<p>Hello, ${this.name || "World"}!</p>`;
  }
}

customElements.define("hello-world5", HelloWorld5);
