// Put your application javascript here
import { delegator } from "./events.js";

console.log("application.js");

const CamelliaTheme = (() => {
  console.log(delegator);

  const state = {
    collection: {
      tags: {},
      products: {},
    },
    quickview: {},
    product: {},
    cart: {},
    user: {},
  };

  return {
    updateState: (key, change) => {
      state[key] = change;
      console.log(state);
    },
    updateSubState: (parentKey, key, change) => {
      state[parentKey][key] = change;
      console.log(state);
    },
  };
})();
