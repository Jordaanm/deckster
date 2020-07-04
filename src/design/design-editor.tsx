import * as React from 'react';
import { CardDesign } from '../stores/types';
import { useObserver } from 'mobx-react-lite';
import AceEditor from "react-ace";
import { Button, H2, EditableText, Tag } from '@blueprintjs/core';
import { useStores } from '../stores/util';
import { IStores } from '../stores/index';

import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/theme-github";

interface DesignEditorProps {
  design?:  CardDesign;
}

const enterEditMode = (host: HTMLElement) => {
  host.classList.add('edit-mode');
}

export const DesignEditor: React.FC<DesignEditorProps> = props => {

  const stores: IStores = useStores();
  const { project } = stores;

  const [svgHost, setSvgHost] = React.useState<HTMLDivElement|null>(null);
  const [placeholders, setPlaceholders] = React.useState<string[]|null>(null);

  return useObserver(() => {
    const { design } = props;
    if(!design) { return null; }

    const {code} = design;

    const changeName = (text: string) => { if(design) { design.name = text; }};

    const updateCode = (newCode: string) => {
      design.code = newCode;
      scanForFields(svgHost);
    };

    const onSvgLoaded = ($div: HTMLDivElement|null) => {
      setSvgHost($div);
      // setTimeout(() => {
      //   scanForFields($div);
      // }, 1000);
    }

    const scanForFields = (svgHost: HTMLDivElement|null) => {
      if (svgHost) {
        const fieldTags: Element[] = Array.from(svgHost.querySelectorAll('[data-fieldid]'));
        const fieldNames: string[] = fieldTags
          .map(x => x.getAttribute('data-fieldid') || '')
          .filter(Boolean);

        setPlaceholders(fieldNames);
      }
    };

    const removeDesign = () => {
      project.designs.remove(design.id);      
    }

    const tagElement = () => {
      if(svgHost !== null) {
        enterEditMode(svgHost);
      }
    }

    console.log("Design Editor Render", design.code, design);

    return (
      <section className="row editor">
        <div className="f1 col">
          <div className="row">
            <H2><EditableText onChange={changeName} value={design.name} /></H2>
            <Button icon="delete" text="Remove this Design" onClick={removeDesign} />
            <Button icon="search-template" text="Tag Section" onClick={tagElement} />
          </div>
          <div className="row f1 full-y">
            <AceEditor
              mode="html"
              theme="github"
              onChange={updateCode}
              name={`DesignEditor${design.id}`}
              editorProps={{ $blockScrolling: true }}
              value={code}
            />
          </div>
          {placeholders && placeholders.length > 0 && <div className="row">
            Identified Fields:
            <div className="row">{placeholders?.map(x =><Tag>{x}</Tag>)}</div>
          </div>}
        </div>
        <div className="f1">
          <div className="full-xy">
            <div className="playing-card" dangerouslySetInnerHTML={{__html: design.code}} ref={x => onSvgLoaded(x)} />
          </div>          
        </div>
      </section>      
    )
  });
}

