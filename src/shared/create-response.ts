// Convert fetchMock data to getProduct API response format
import processColors from "./process-colors";
import {
  ProductItemRaw,
  ProductItemProcessed,
} from "../types";

const createResponse = (
  array: ProductItemRaw[],
  val: string,
  val_two: string
): ProductItemProcessed[] => {
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
