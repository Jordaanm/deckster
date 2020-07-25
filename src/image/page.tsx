import * as React from 'react';
import { useObserver} from 'mobx-react-lite';
import { useStores } from '../stores/util';
import { IStores } from '../stores/index';
import { H1, ControlGroup, Button } from '@blueprintjs/core';
import { Project } from '../stores/project';
import { ImageEditor } from './editor';

import { entitySelect } from '../app/entity-select';

export const Images: React.FC = () => {
  const [$fileInput, setFileInput] = React.useState<HTMLInputElement|null>();

  const stores: IStores = useStores();  
  const project: Project = stores.project;
    
  return useObserver(() => {
    const store = project.images;
    
    const loadFile = (e: any) => {
      if(e?.target?.files?.length > 0) {
        var reader = new FileReader();
        reader.onload = function(){
          var dataURL = reader.result;
          const data = dataURL?.toString();
          if (data) {
            store.addNew(true, {data});
          }
        };
        reader.readAsDataURL(e.target.files[0]);  
      }
    };

    const triggerFile = () => {
      if($fileInput) {
        $fileInput.click();
      }
    };

    return (
      <section className="app-section card-designs">
        <H1>{store.label}</H1>
        <div className="col">
          <div className="row">
            <ControlGroup fill={true}>
              {entitySelect(store)}
              <input
                type="file"
                accept=".jpg, .png"
                ref={x => setFileInput(x)}
                onChange={loadFile}
                className="hidden"
              />              
              <Button icon="add" text="Add New Image" onClick={triggerFile}/>
            </ControlGroup>
          </div>
          <ImageEditor image={store.currentItem} />
        </div>
      </section>
    );
  });
};