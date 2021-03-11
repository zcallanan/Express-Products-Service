import createResponse from "../../shared/create-response";
import { ArrayProductItemRaw, ProductAPIRes } from "../../types";

const deleteData: ArrayProductItemRaw = [
  {
    id: "0016516931359f9277205a0f",
    name: "ILLEAKOL METROPOLIS STAR",
    type: "beanies",
    manufacturer: "ippal",
    color: ["yellow", "grey"],
    price: 51,
  },
];

const deleteRes: ProductAPIRes = {
  beanies: createResponse(deleteData, "In Stock", "Out of Stock"),
};

export { deleteData, deleteRes };
