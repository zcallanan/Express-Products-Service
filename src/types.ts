/*
getProduct API
*/

// JSON API object for testing
export type ProductAPIRes = {
  [key: string]: ProductItemProcessed[];
};

// getProduct API item data for testing
export type ProductItemProcessed = {
  id: string;
  type: string;
  name: string;
  color: string;
  price: number;
  manufacturer: string;
  availability?: string;
};

/*
Third Party Product API
*/

// Product data API content
export type ProductItemRaw = {
  id: string;
  name: string;
  type: string;
  manufacturer: string;
  color: string[];
  price: number;
};

/*
Third Party Manufacturer API
*/

// Manufacturer availability API
export type ManAPIRes = {
  code: number;
  response: ManIdPayload[];
};

// Manufacturer response data object
export type ManIdPayload = {
  id: string;
  DATAPAYLOAD: string;
};

/*
Redis
*/

export type ProductRedisHash = {
  [key: string]: ProductItemRaw[];
};

export type ManRedisHash = {
  [key: string]: ManIdPayload[];
};

/*
Generic
*/

// { key: Array<string> }
export type StringList = {
  [key: string]: string[];
};
