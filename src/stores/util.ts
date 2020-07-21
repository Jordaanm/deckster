import * as React from 'react';
import { MobXProviderContext } from 'mobx-react'
import { IStores } from './index';

export function useStores(): IStores {
  return React.useContext(MobXProviderContext) as IStores;
}

type readerCallback = (result: string|ArrayBuffer|null) => void;

export const fileLoader = (callback: readerCallback) => (e:any) => {
  if(e?.target?.files?.length > 0) {
    var reader = new FileReader();
    reader.onload = function(){
      callback(reader.result);
    };
    reader.readAsDataURL(e.target.files[0]);  
  }
};