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
  {
    id: "0101fee1a3f1041d695a",
    name: "OOTGIN TREE",
    type: "beanies",
    manufacturer: "abiplos",
    color: "yellow",
    price: 14,
    availability: "Less Than 10",
  },
  {
    id: "03182fa0a73cf88594e",
    name: "REVLEA MULTI CITY",
    type: "beanies",
    manufacturer: "umpante",
    color: "red, grey",
    price: 340,
    availability: "Out of Stock",
  },
];

const facemasksData = [
  {
    id: "005ae7ab52fe37eee54",
    name: "REVEMUP NORMAL FLOWER",
    type: "facemasks",
    manufacturer: "juuran",
    color: "grey",
    price: 40,
    availability: "In Stock",
  },
  {
    id: "01a125b7c43e7f16c519a",
    name: "ÖISLEAJE NORMAL",
    type: "facemasks",
    manufacturer: "niksleh",
    color: "yellow",
    price: 35,
    availability: "Availability Unknown",
  },
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
    id: "359364eae1c8f0416ead",
    name: "ILTAI STAR GREEN",
    type: "gloves",
    manufacturer: "niksleh",
    color: "white, yellow",
    price: 96,
    availability: "Unknown Availability",
  },
  {
    id: "3622a9a55d674c4f883",
    name: "ÖISSOP NORMAL BUCK",
    type: "gloves",
    manufacturer: "okkau",
    color: "blue",
    price: 93,
    availability: "Less Than 10",
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

const beaniesRes = {
  beanies: beaniesData,
};

const beaniesRedisRes = {
  beanies_test: beaniesData,
};

const facemasksRes = {
  facemasks: facemasksData,
};

const facemasksRedisRes = {
  facemasks_test: facemasksData,
};

const glovesRes = {
  gloves: glovesData,
};

const glovesRedisRes = {
  gloves_test: glovesData,
}

module.exports = {
  beaniesRes,
  facemasksRes,
  glovesRes,
  beaniesRedisRes,
  facemasksRedisRes,
  glovesRedisRes,
};
