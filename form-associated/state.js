class State {
  static instance = new State();
  static {
    this.instance = new State();
  }

  #favoriteColor = "transparent";
  #propertyToListenersMap = new Map();

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
    this.#favoriteColor = color;
    this.notifyListeners("favoriteColor");
  }
}

window.State = State;
