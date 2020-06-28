import { TxOperation, TxType } from '../stores/types';

export const parseInteger: TxOperation = {
  name: 'Parse Integer',
  input: TxType.STRING,
  output: TxType.NUMBER,
  pipe: (value) => typeof value == 'number' ? value : parseInt(value, 10)
};

export const stringify: TxOperation = {
  name: 'Stringify',
  input: TxType.NUMBER,
  output: TxType.STRING,
  pipe: (value) => value.toString()
}

export const repeat: TxOperation = {
  name: 'Repeat String',
  input: TxType.NUMBER,
  output: TxType.STRING,
  pipe: (value, params) => (new Array(value)).map(() => params[0]).join('')
}