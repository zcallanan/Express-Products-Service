// Convert fetchMock data to getProduct API response format
import processColors from "./process-colors";
import {
  ProductItemRaw,
  ProductItemProcessed,
} from "../types";

const createResponse = (
  array: ProductItemRaw[],
  val: string,
  val_two: string,
): ProductItemProcessed[] => {
  const copy: ProductItemProcessed = {
    id: "",
    type: "",
    name: "",
    color: "",
    manufacturer: "",
    price: 0,
  };
  return array.map(({ ...item }, index) => {
    // Create a copy or TypeScript complains
    Object.assign(copy, item);
    copy.availability = (index === 0) ? val : val_two;
    copy.color = processColors(item.color);
    return { ...copy };
  }, copy);
};

export default createResponse;
