import { ProductItemProcessed, ProductAPIRes } from "../../types";

// getProduct array data
const beaniesData: ProductItemProcessed[] = [
  {
    id: "0016516931359f9277205a0f",
    name: "ILLEAKOL METROPOLIS STAR",
    type: "beanies",
    manufacturer: "ippal",
    color: "yellow, grey",
    price: 51,
    availability: "In Stock",
  },
  {
    id: "003911ce74aeef0d5c6250",
    name: "TAIAKSOP BRIGHT BUCK",
    type: "beanies",
    manufacturer: "juuran",
    color: "green",
    price: 44,
    availability: "Availability Unknown",
  },
];

const facemasksData: ProductItemProcessed[] = [
  {
    id: "01fe877cbe49cd19a45a",
    name: "OOTGINKOL ANIMAL FANTASY",
    type: "facemasks",
    manufacturer: "umpante",
    color: "black",
    price: 62,
    availability: "Less Than 10",
  },
  {
    id: "077a1b3093954816e5fd",
    name: "NYYYOOT RAIN",
    type: "facemasks",
    manufacturer: "abiplos",
    color: "green",
    price: 79,
    availability: "Out of Stock",
  },
];

const glovesData: ProductItemProcessed[] = [
  {
    id: "001ffc6816f71dbdc0d59",
    name: "SOPIL BOON",
    type: "gloves",
    manufacturer: "niksleh",
    color: "green, purple",
    price: 65,
    availability: "In Stock",
  },
  {
    id: "3d4706451baa173f5ae12b0",
    name: "UPSOPAK CITY ROOM",
    type: "gloves",
    manufacturer: "laion",
    color: "red",
    price: 51,
    availability: "Out of Stock",
  },
];

// getProduct DB query responses
const beaniesRes: ProductAPIRes = {
  beanies: beaniesData,
};

const facemasksRes: ProductAPIRes = {
  facemasks: facemasksData,
};

const glovesRes: ProductAPIRes = {
  gloves: glovesData,
};

// getProduct Redis responses
const beaniesRedisRes: ProductAPIRes = {
  beanies_test: beaniesData,
};

const facemasksRedisRes: ProductAPIRes = {
  facemasks_test: facemasksData,
};

const glovesRedisRes: ProductAPIRes = {
  gloves_test: glovesData,
};

export {
  beaniesRes,
  facemasksRes,
  glovesRes,
  beaniesRedisRes,
  facemasksRedisRes,
  glovesRedisRes,
  beaniesData,
  facemasksData,
  glovesData,
};
