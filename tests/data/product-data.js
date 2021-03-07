// getProduct array data
const beaniesData = [
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

const facemasksData = [
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

const glovesData = [
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
const beaniesRes = {
  beanies: beaniesData,
};

const facemasksRes = {
  facemasks: facemasksData,
};

const glovesRes = {
  gloves: glovesData,
};

// getProduct Redis responses
const beaniesRedisRes = {
  beanies_test: beaniesData,
};

const facemasksRedisRes = {
  facemasks_test: facemasksData,
};

const glovesRedisRes = {
  gloves_test: glovesData,
};

module.exports = {
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
