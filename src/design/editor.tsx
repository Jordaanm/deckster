import * as React from 'react';
import { CardDesign } from '../stores/types';
import { useObserver } from 'mobx-react-lite';
import AceEditor from "react-ace";
import { Button, H2, EditableText, Tag, H3 } from '@blueprintjs/core';
import { useStores } from '../stores/util';
import { IStores } from '../stores/index';

import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/mode-css";
import "ace-builds/src-noconflict/theme-monokai";

interface DesignEditorProps {
  design?:  CardDesign;
}

export const DesignEditor: React.FC<DesignEditorProps> = props => {

  const stores: IStores = useStores();
  const { project } = stores;

  const [svgHost, setSvgHost] = React.useState<HTMLDivElement|null>(null);
  const [placeholders, setPlaceholders] = React.useState<string[]|null>(null);

  return useObserver(() => {
    const { design } = props;
    if(!design) { return null; }

    const {code, styles} = design;

    const changeName = (text: string) => { if(design) { design.name = text; }};

    const updateCode = (newCode: string) => {
      design.code = newCode;
      scanForFields(svgHost);
    };

    const updateStyle = (newStyles: string) => {
      design.styles = newStyles;
    };

    const onSvgLoaded = ($div: HTMLDivElement|null) => {
      setSvgHost($div);
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

    return (
      <section className="row editor">
        <div className="f1 col">
          <div className="row">
            <H2><EditableText onChange={changeName} value={design.name} /></H2>
            <Button icon="delete" text="Remove this Design" onClick={removeDesign} />
          </div>
          <div className="col full-y f1">
            <div className="col f1">
              <H3>Style</H3>
              <AceEditor
                mode="css"
                theme="monokai"
                onChange={updateStyle}
                name={`DesignEditorStyles${design.id}`}
                editorProps={{ $blockScrolling: true }}
                value={styles}
                />
            </div>
            <div className="col f1">
              <H3>HTML</H3>
              <AceEditor
                mode="html"
                theme="monokai"
                onChange={updateCode}
                name={`DesignEditorHtml${design.id}`}
                editorProps={{ $blockScrolling: true }}
                value={code}
                />
            </div>
          </div>
          {placeholders && placeholders.length > 0 && <div className="row">
            Identified Fields:
            <div className="row">{placeholders?.map(x =><Tag>{x}</Tag>)}</div>
          </div>}
        </div>
        <div className="f1">
          <div className="full-xy">
            <style dangerouslySetInnerHTML={{__html: design.styles}} />
            <div className="playing-card" dangerouslySetInnerHTML={{__html: design.code}} ref={x => onSvgLoaded(x)} />
          </div>          
        </div>
      </section>      
    )
  });
}

