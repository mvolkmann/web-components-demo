class State {
  static instance = new State();
  #favoriteColor = "transparent";
  #propertyToCallbacksMap = new Map();

  constructor() {
    if (State.instance) {
      throw new Error("get singleton instance with State.instance");
    }
    State.instance = this;
  }

  addCallback(property, callback) {
    let callbacks = this.#propertyToCallbacksMap.get(property);
    if (!callbacks) {
      callbacks = [];
      this.#propertyToCallbacksMap.set(property, callbacks);
    }
    callbacks.push(callback);
  }

  changed(property) {
    let callbacks = this.#propertyToCallbacksMap.get(property) || [];
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
    this.changed("favoriteColor");
  }
}

window.State = State;
