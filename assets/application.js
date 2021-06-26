// Put your application javascript here
import { delegator } from "./event-lib.js";

console.log("application.js");

const CamelliaTheme = (() => {
  delegator.delegate();

  const state = {
    collection: {
      tags: {},
      products: {},
      url: {},
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

Shopify.CamelliaTheme = CamelliaTheme;
