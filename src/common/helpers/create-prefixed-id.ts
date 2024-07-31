import { customAlphabet } from 'nanoid';
const alphabet =
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
export const customNanoid = customAlphabet(alphabet, 10);
export const createPrefixedId = (prefix: string): string =>
  `${prefix}_${customNanoid()}`;
