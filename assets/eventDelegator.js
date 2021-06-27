const EventDelegator = (() => {
  let watchlist = [];

  const updateWatchlist = (type, className, callback) => {
    if (!type || !className || !callback) return;
    if (!watchlist[type]) watchlist[type] = [];
    watchlist[type].push({ className, callback });
  };

  const shouldFire = (type, e, className) => {
    if (type === "DOMContentLoaded" || type === "load") return true;
    return [...e.target.classList].includes(className);
  };

  const handler = (type, e) => {
    const pairs = watchlist[type];

    pairs.map(({ className, callback }) => {
      if (shouldFire(type, e, className)) callback(e);
    });
  };

  const delegate = () => {
    Object.keys(watchlist).map((type) => {
      window.addEventListener(type, (e) => handler(type, e), true);
    });
  };

  return {
    updateWatchlist,
    delegate,
  };
})();
