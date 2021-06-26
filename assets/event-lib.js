const apiCall = new CustomEvent("api-called", {
  bubbles: true,
  cancelable: true,
});

class EventDelegator {
  constructor(watchlist) {
    this.watchlist = watchlist || {};
  }

  setWatchlist(watchlist) {
    if (watchlist) this.watchlist = watchlist;
  }

  updateWatchlist(type, className, callback) {
    if (!type || !className || !callback) return;

    if (!this.watchlist[type]) this.watchlist[type] = [];

    this.watchlist[type].push({ className, callback });
  }

  shouldFire(type, e, className) {
    if (type === "DOMContentLoaded" || type === "load") return true;
    return [...e.target.classList].includes(className);
  }

  handler(type, e) {
    const pairs = this.watchlist[type];

    pairs.map(({ className, callback }) => {
      if (this.shouldFire(type, e, className)) callback(e);
    });
  }

  delegate() {
    Object.keys(this.watchlist).map((type) => {
      window.addEventListener(type, (e) => this.handler(type, e), true);
    });
  }
}

const delegator = new EventDelegator();

export { delegator };
