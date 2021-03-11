export type ProductItemProcessed = {
  id: string,
  type: string,
  name: string,
  color: string,
  price: number,
  manufacturer: string,
  availability?: string
}

export type ArrayProductItemProcessed = ProductItemProcessed[];

export type ProductItemRaw = {
  id: string,
  name: string,
  type: string,
  manufacturer: string,
  color: string[],
  price: number
 }

export type ArrayProductItemRaw = ProductItemRaw[];

export type ProductItemObject = {
  [key: string]: ArrayProductItemRaw
}

export type ManufacturerItem = {
  code: number,
  response: ManufacturerResData[]
};

export type ArrayManufacturerItem = ManufacturerItem[];

export type ManufacturerObject = {
  [key: string]: ArrayManufacturerItem
};

export type ManufacturerResData = {
  id: string,
  DATAPAYLOAD: string
};

export type ProductAPIRes = {
  [key: string]: ArrayProductItemProcessed
};

export type StringList =  {
  [key: string]: string[],
};

export type StringObj = { [key: string]: string }
