const beaniesInsert = [
  {
    id: "0016516931359f9277205a0f",
    type: "beanies",
    name: "ILLEAKOL METROPOLIS STAR",
    color: ["yellow", "grey"],
    price: 51,
    manufacturer: "ippal",
  },
  {
    id: "003911ce74aeef0d5c6250",
    type: "beanies",
    name: "TAIAKSOP BRIGHT BUCK",
    color: ["green"],
    price: 44,
    manufacturer: "juuran",
  },
  {
    id: "91afd5d90ff9a173b5be",
    type: "beanies",
    name: "REVUPVE BUCK",
    color: ["grey"],
    price: 91,
    manufacturer: "abiplos",
  },
];

const ippalRes = {
  code: 200,
  response: [
    {
      id: "0016516931359F9277205A0F",
      DATAPAYLOAD:
        "<AVAILABILITY>\n  <CODE>200</CODE>\n  <INSTOCKVALUE>INSTOCK</INSTOCKVALUE>\n</AVAILABILITY>"
    },
  ],
};

const juuranRes = {
  code: 200,
  response: [
    {
      id: "B36FC3CC9EEBA54B1B5CD1",
      DATAPAYLOAD:
        "<AVAILABILITY>\n  <CODE>200</CODE>\n  <INSTOCKVALUE>INSTOCK</INSTOCKVALUE>\n</AVAILABILITY>"
    },
  ],
};

const abiplosRes = {
  code: 200,
  response: [
    {
      id: "91AFD5D90FF9A173B5BE",
      DATAPAYLOAD:
        "<AVAILABILITY>\n  <CODE>200</CODE>\n  <INSTOCKVALUE>OUTOFSTOCK</INSTOCKVALUE>\n</AVAILABILITY>"
    },
  ],
};

module.exports = { beaniesInsert, ippalRes, juuranRes, abiplosRes };
