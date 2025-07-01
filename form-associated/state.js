class State {
  static instance = new State();
  #favoriteColor = "transparent";
  #propertyToListenersMap = new Map();

  constructor() {
    if (State.instance) {
      throw new Error("get singleton instance with State.instance");
    }
    State.instance = this;
  }

  addListener(property, callback) {
    let listeners = this.#propertyToListenersMap.get(property);
    if (!listeners) {
      listeners = [];
      this.#propertyToListenersMap.set(property, listeners);
    }
    listeners.push(callback);
  }

  notifyListeners(property) {
    let callbacks = this.#propertyToListenersMap.get(property) || [];
    for (const callback of callbacks) {
      callback(this[property]);
    }
  }

  get favoriteColor() {
    return this.#favoriteColor;
  }

  set favoriteColor(color) {
    if (color === this.#favoriteColor) return;
    this.#favoriteColor = color;
    this.notifyListeners("favoriteColor");
  }
}

window.State = State;
