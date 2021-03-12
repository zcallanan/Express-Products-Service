import createResponse from "../../shared/create-response";
import { ProductItemRaw, ProductAPIRes, ManAPIRes } from "../../types";


// FetchMock data for db insertion
export const insertData: ProductItemRaw[] = [
  {
    id: "0016516931359f9277205a0f",
    name: "ILLEAKOL METROPOLIS STAR",
    type: "beanies",
    manufacturer: "ippal",
    color: ["yellow", "grey"],
    price: 51,
  },
  {
    id: "003911ce74aeef0d5c6250",
    name: "TAIAKSOP BRIGHT BUCK",
    type: "beanies",
    manufacturer: "juuran",
    color: ["green"],
    price: 44,
  },
  {
    id: "91afd5d90ff9a173b5be",
    name: "REVUPVE BUCK",
    type: "beanies",
    manufacturer: "abiplos",
    color: ["grey"],
    price: 91,
  },
];

// Insert response to be tested
export const insertRes: ProductAPIRes = {
  beanies: createResponse(insertData, "In Stock", "Out of Stock"),
};

// Fetchmock manufacturer availability data
export const ippalData: ManAPIRes = {
  code: 200,
  response: [
    {
      id: "0016516931359F9277205A0F",
      DATAPAYLOAD:
        "<AVAILABILITY>\n  <CODE>200</CODE>\n  <INSTOCKVALUE>INSTOCK</INSTOCKVALUE>\n</AVAILABILITY>",
    },
  ],
};

export const juuranData: ManAPIRes = {
  code: 200,
  response: [
    {
      id: "003911CE74AEEF0D5C6250",
      DATAPAYLOAD:
        "<AVAILABILITY>\n  <CODE>200</CODE>\n  <INSTOCKVALUE>OUTOFSTOCK</INSTOCKVALUE>\n</AVAILABILITY>",
    },
  ],
};

export const abiplosData: ManAPIRes = {
  code: 200,
  response: [
    {
      id: "91AFD5D90FF9A173B5BE",
      DATAPAYLOAD:
        "<AVAILABILITY>\n  <CODE>200</CODE>\n  <INSTOCKVALUE>OUTOFSTOCK</INSTOCKVALUE>\n</AVAILABILITY>",
    },
  ],
};
