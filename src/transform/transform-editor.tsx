import * as React from 'react';
import { Button, H2, EditableText, Callout, Intent } from '@blueprintjs/core';
import { useObserver } from 'mobx-react-lite';
import { Transform } from '../stores/types';
import { useStores } from '../stores/util';
import { IStores } from '../stores/index';

interface TransformEditorProps {
  transform?:  Transform;
}

export const TransformEditor: React.FC<TransformEditorProps> = props => {

  const stores: IStores = useStores();
  const { project } = stores;

  return useObserver(() => {
    const { transform } = props;
    if(!transform) { return null; }

    const changeName = (text: string) => { if(transform) { transform.name = text; }};

    const removeTransform = () => {
      project.removeTransform(transform.id);      
    }

    return (
      <section className="row editor">
        <div className="f1 col">
          <div className="row">
            <H2><EditableText onChange={changeName} value={transform.name} /></H2>
            <Button icon="delete" text="Remove this Transform" onClick={removeTransform} />
            <Button icon="add-to-artifact" text="Add New Step" onClick={console.log.bind(console, 'ADD')} />
          </div>
          <div className="row">
            {(transform.steps.length === 0) && <Callout
              title="No Steps Defined"
              intent={Intent.WARNING}
              icon="step-chart"
            ></Callout> }
          </div>
        </div>
      </section>
    )
  });
}

