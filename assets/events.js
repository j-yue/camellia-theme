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

  shouldFire(target, className) {
    return [...target.classList].includes(className);
  }

  handler(type, e) {
    const pairs = this.watchlist[type];
    const target = e.target;

    pairs.map(({ className, callback }) => {
      if (this.shouldFire(target, className)) callback(e);
    });
  }

  delegate() {
    if (!this.watchlist) return;

    Object.keys(this.watchlist).map((type) => {
      window.addEventListener(type, (e) => this.handler(type, e), true);
    });
  }
}

export const delegator = new EventDelegator();
