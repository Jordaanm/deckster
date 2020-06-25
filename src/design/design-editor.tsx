import * as React from 'react';
import { CardDesign } from '../stores/types';
import { useObserver } from 'mobx-react-lite';
import CodeMirror from 'react-codemirror';
import { Button, H2, EditableText } from '@blueprintjs/core';
import { useStores } from '../stores/util';
import { IStores } from '../stores/index';

import "codemirror/mode/htmlmixed/htmlmixed";
import "codemirror/lib/codemirror.css";


interface DesignEditorProps {
  design?:  CardDesign;
}

const cmOptions = {
  lineNumbers: true,
  lineWrapping: true,
  mode: 'htmlmixed'
};

export const DesignEditor: React.FC<DesignEditorProps> = props => {

  const stores: IStores = useStores();
  const { project } = stores;

  return useObserver(() => {
    const { design } = props;
    if(!design) { return null; }

    const changeName = (text: string) => { if(design) { design.name = text; }};

    const updateCode = (newCode: string) => {
      design.code = newCode;
    };

    const removeDesign = () => {
      project.removeDesign(design.id);      
    }

    return (
      <section className="row editor">
        <div className="f1 col">
          <div className="row">
            <H2><EditableText onEdit={changeName} value={design?.name} /></H2>
            <Button icon="delete" text="Remove this Design" onClick={removeDesign}/>
          </div>
          <div className="row f1 full-y">
            <CodeMirror value={design?.code} onChange={updateCode} options={cmOptions} />
          </div>          
        </div>
        <div className="f1">
          <div className="full-xy" dangerouslySetInnerHTML={{__html: design.code}} />
        </div>
      </section>      
    )
  });
}

