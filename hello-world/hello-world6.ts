import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("hello-world6")
export class HelloWorld6 extends LitElement {
  @property({ type: String }) name = "";

  render() {
    return html`<p>Hello, ${this.name || "World"}!</p>`;
  }
}
