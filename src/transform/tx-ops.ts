import { TxOperation, TxType } from '../stores/types';

export const identity: TxOperation = {
  name: 'Identity',
  description: 'Returns the same value it is given',
  input: TxType.STRING,
  output: TxType.STRING,
  paramNames: [],
  pipe: (value) => value
};

export const parseInteger: TxOperation = {
  name: 'Parse Integer',
  description: 'Convert a String into a Number',
  input: TxType.STRING,
  output: TxType.NUMBER,
  paramNames: [],
  pipe: (value) => typeof value == 'number' ? value : parseInt(value, 10)
};

export const stringify: TxOperation = {
  name: 'Stringify',
  description: 'Convert a Number into a String',
  input: TxType.NUMBER,
  output: TxType.STRING,
  paramNames: [],
  pipe: (value) => value.toString()
}

export const repeat: TxOperation = {
  name: 'Repeat String',
  description: 'Repeats the String in the Text param N number of times',
  input: TxType.NUMBER,
  output: TxType.STRING,
  paramNames: ['text'],
  pipe: (value, params) => (new Array(value)).map(() => params[0]).join('')
}

export const toUpper: TxOperation = {
  name: 'To Uppercase',
  description: 'Converts a string to uppercase',
  input: TxType.STRING,
  output: TxType.STRING,
  paramNames: [],
  pipe: (value) => value.toString().toUpperCase()
}