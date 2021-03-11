type ProductItemProcessed = {
  id: string,
  type: string,
  name: string,
  color: string,
  price: number,
  manufacturer: string,
  availability?: string
}

type ArrayProductItemProcessed = Array<ProductItemProcessed>;

type ProductItemRaw = {
  id: string,
  name: string,
  type: string,
  manufacturer: string,
  color: Array<string>,
  price: number
 }

type ArrayProductItemRaw = Array<ProductItemRaw>;

type ManufacturerItem = {
  code: number,
  response: Array<ManufacturerResData>
};

type ArrayManufacturerItem = Array<ManufacturerItem>;

type ManufacturerObject = {
  [key: string]: ArrayManufacturerItem
};

type ManufacturerResData = {
  id: string,
  DATAPAYLOAD: string
};

type ProductAPIRes = {
  [key: string]: ArrayProductItemProcessed
};

type StringList =  {
  [key: string]: Array<string>,
};

type StringObj = { [key: string]: string }
