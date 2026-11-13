export const CONFIG = {
  MAX_PRODUCTS: 20,
  BASE_URL: "https://www.google.com/search?tbm=shop&q=",
  SELECTORS: {
    productCard: [
      ".sh-dgr__grid-result", 
      ".sh-dlr__list-result", 
      "[data-docid]"
    ],
    title: [
      ".sh-np__product-title", 
      "h3", 
      ".Xjkr3b", 
      ".tAxDx"
    ],
    price: [
      ".a8331b", 
      ".OFFNJ", 
      ".hn9b2c", 
      ".aULbyd"
    ],
    oldPrice: [
      ".T8331b", 
      ".lh9b2c"
    ],
    image: [
      ".Arb96c", 
      "img", 
      ".QD6bS img"
    ],
    store: [
      ".aULbyd", 
      ".Iu7j6c", 
      ".E5beS", 
      ".mB18Hc"
    ],
    rating: [
      "[aria-label*='estrelas']", 
      "[aria-label*='stars']"
    ],
    reviews: [
      ".Rsc7Ub", 
      ".fl", 
      ".NzUzee"
    ],
    shipping: [
      ".vEj384", 
      ".Ol9Y6", 
      ".GeUre"
    ],
    link: [
      "a.shntl", 
      "a[href*='/shopping/product']", 
      "a"
    ]
  }
};