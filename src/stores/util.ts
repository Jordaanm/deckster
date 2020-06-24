import * as React from 'react';
import { MobXProviderContext } from 'mobx-react'
import { IStores } from './index';

export function useStores(): IStores {
  return React.useContext(MobXProviderContext) as IStores;
}