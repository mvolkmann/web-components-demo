class State {
  #favoriteColor;

  constructor() {
    this.#favoriteColor = "transparent";
  }
  get favoriteColor() {
    return this.#favoriteColor;
  }
  set favoriteColor(color) {
    this.#favoriteColor = color;
  }
}

export default State;
