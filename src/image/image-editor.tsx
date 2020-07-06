import * as React from 'react';
import { Image } from '../stores/types';
import { useObserver } from 'mobx-react-lite';
import { Button, H2, EditableText } from '@blueprintjs/core';
import { useStores } from '../stores/util';
import { IStores } from '../stores/index';

import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/theme-monokai";

interface ImageEditorProps {
  image?:  Image;
}

export const ImageEditor: React.FC<ImageEditorProps> = props => {

  const stores: IStores = useStores();
  const { project } = stores;


  return useObserver(() => {
    const { image } = props;
    if(!image) { return null; }

    const {data, name} = image;

    const changeName = (text: string) => { if(image) { image.name = text; } };

    const removeImage = () => {
      project.images.remove(image.id);      
    }

    return (
      <section className="row editor">
        <div className="f1 col">
          <div className="row">
            <H2><EditableText onChange={changeName} value={name} /></H2>
            <Button icon="delete" text="Remove this Image" onClick={removeImage} />
          </div>
        </div>
        <div className="f1">
          <div className="full-xy">
            <div className="image-preview">
              <img src={data} alt={`${name}`} />
            </div>
          </div>          
        </div>
      </section>      
    )
  });
}

