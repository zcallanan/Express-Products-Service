// Convert fetchMock data to getProduct API response format
import processColors from "./process-colors";
import {
  ArrayProductItemRaw,
  ArrayProductItemProcessed,
  ProductItemProcessed,
} from "../types";

const createResponse = (
  array: ArrayProductItemRaw,
  val: string,
  val_two: string
): ArrayProductItemProcessed => {
  return array.map(({ ...item }, index) => {
    // Create a copy or TypeScript complains
    const copy: ProductItemProcessed = {
      id: "",
      type: "",
      name: "",
      color: "",
      manufacturer: "",
      price: 0,
    };

    Object.assign(copy, item);
    index === 0
      ? (copy["availability"] = val)
      : (copy["availability"] = val_two);
    copy["color"] = processColors(item.color);
    return copy;
  });
};

export default createResponse;
