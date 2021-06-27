const EventDelegator = (() => {
  let watchlist = [];

  const updateWatchlist = (type, className, callback) => {
    if (!type || !className || !callback) return;
    if (!watchlist[type]) watchlist[type] = [];
    watchlist[type].push({ className, callback });
  };

  const findIntersection = (el, allClasses) => {
    return [...el.classList].filter((cn) => allClasses.includes(cn));
  };

  const shouldFire = (type, e, className) => {
    if (type === "DOMContentLoaded" || type === "load") return true;

    const path = e.path;

    const allClasses = watchlist[type].map(({ className: cn }) => cn);

    for (let i = 0; i < path.length; i++) {
      const intersection = findIntersection(path[i], allClasses);

      if (intersection.length > 0) {
        if (intersection.includes(className)) return true;
        return false;
      }
    }

    return false;
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
