import * as React from 'react';
import { useObserver } from 'mobx-react-lite';
import { H2, EditableText, Button, ButtonGroup, MenuItem, Drawer, Classes, Label, HTMLSelect, NumericInput } from '@blueprintjs/core';
import { Select } from '@blueprintjs/select';
import { Render, CardDesign, DataSet, IEntity } from '../stores/types';
import { IStores } from '../stores/index';
import { useStores } from '../stores/util';
import { defaultEntityItemRenderer } from '../app/entity-select';
import { EntityStore } from '../stores/entity-store';
import {
  PLAYING_CARD_CSS,
  CardBackSettings,
  RenderInfo,
  generateRenderInfo,
  svgForCard
} from '../utils/card-utils';
import {
  triggerDownload,
  saveDeckToZip
} from '../utils/file-utils';
import {  
  renderBlobToCanvas,
  blobForSVG
} from '../utils/render-utils';

import './render.scss'
import { FieldTransformView } from './field-transforms';

interface DeckRenderEditorProps {
  config?: Render;
};

const drawerProps = {
  size: "100%",
  autoFocus: true,
  canEscapeKeyClose: true,
  canOutsideClickClose: true,
  enforceFocus: true,
  title: "Card Images",
};

const saveCard = async (html: string, css: string, ratio: number) => {
  
  const svg = svgForCard(html, css);
  const blob = blobForSVG(svg);

  const canvas = await renderBlobToCanvas(blob, ratio);

  const imgURI = canvas
  .toDataURL('image/png')
  .replace('image/png', 'image/octet-stream');

  triggerDownload(imgURI);
};

export const DeckRenderEditor: React.FC<DeckRenderEditorProps> = (props) => {

  const stores: IStores = useStores();
  const { project } = stores;
  const [showDrawer, setShowDrawer] = React.useState<Boolean>(false);

  const [cardBackSettings, setCardBackSettings] = React.useState<string>(CardBackSettings.COLLATE);
  const [ratio, setRatio] = React.useState<number>(1);
  const [cardRenderInfo, setCardRenderInfo] = React.useState<RenderInfo[]>([]);

  return useObserver(() => {
    const { config } = props;


    if (!config) { return null; }
    
    const toggleDrawer = () => setShowDrawer(!showDrawer);

    const changeName = (text: string) => { if(config) { config.name = text; }};
    const setDesign = (design: IEntity) => { config.cardDesign = design.id; }
    const setBackDesign = (design: IEntity) => { config.cardBackDesign = design.id; }
    const setDataSet = (dataSet: IEntity) => { config.dataSet = dataSet.id; }
    const remove = () => project.renders.remove(config.id);

    const dataSet: DataSet|undefined = project.datasets.find(config.dataSet || undefined);
    const design: CardDesign|undefined = project.designs.find(config.cardDesign || undefined);
    const backDesign: CardDesign|undefined = project.designs.find(config.cardBackDesign || undefined);


    const updateRenderInfo = (cardBackSettings: string) => {
      const renderInfo = generateRenderInfo(design, backDesign, dataSet, config.fieldTransforms, cardBackSettings, project);
      setCardRenderInfo(renderInfo);
    }

    const openDrawer = () => {
      updateRenderInfo(cardBackSettings);
      toggleDrawer();
    };

    const generateZip = () => {
      const renderInfo = generateRenderInfo(design, backDesign, dataSet, config.fieldTransforms, cardBackSettings, project);
      saveDeckToZip(renderInfo, ratio);
    }

    return (
      <section className="row editor">
        <div className="f1 col">
          <div className="row">
            <H2><EditableText onChange={changeName} value={config.name} /></H2>
            <ButtonGroup>
              <Button icon="delete" text="Remove this Card Set" onClick={remove} />
              <Button icon="download" text="Download as Zip" onClick={generateZip} />
            </ButtonGroup>
          </div>
          <div className="row">
            <Label>
              Card Face Design
              {configEntitySelect<CardDesign>(project.designs, setDesign, design)}
            </Label>      
          </div>
          <div className="row">
            <Label>
              Card Back Design
              {configEntitySelect<CardDesign>(project.designs, setBackDesign, backDesign)}
            </Label>      
          </div>
          <div className="row">
            <Label>
              Data Set
              {configEntitySelect(project.datasets, setDataSet, dataSet)}
            </Label>         
          </div>
          <div className="row">
            <Label>
              Transforms
              <FieldTransformView deck={config} />
            </Label>
          </div>
          <div className="row">
            <Label>
              Card Back Placement
              <HTMLSelect value={cardBackSettings} onChange={e => setCardBackSettings(e.target.value)}>
                <option value={CardBackSettings.NONE}>Don't Render Backs</option>
                <option value={CardBackSettings.FIRST}>Only Render The First Back</option>
                <option value={CardBackSettings.AFTER}>Render Backs after Faces</option>
                <option value={CardBackSettings.COLLATE}>Collate Card Faces and Backs</option>
              </HTMLSelect>
            </Label>
          </div>
          <div className="row">
            <Label>
              Image Scale
              <NumericInput value={ratio} onValueChange={setRatio} leftIcon="maximize"/>
            </Label>
          </div>
          <div className="row">
            <Button onClick={openDrawer}>Generate Cards</Button>
          </div>
        </div>
        <Drawer
          onClose={toggleDrawer}
          isOpen={Boolean(showDrawer)}
          icon="info-sign"
          {...drawerProps}
        >
          <div className={Classes.DRAWER_BODY}>
            <div className={Classes.DIALOG_BODY}>
              <style dangerouslySetInnerHTML={{__html: design?.styles||'' }}/>
              <style dangerouslySetInnerHTML={{__html: backDesign?.styles||'' }}/>
              <style dangerouslySetInnerHTML={{__html: PLAYING_CARD_CSS}} />
              <div className="card-list row wrap">
                {cardRenderInfo.map((x: RenderInfo, i: number) => (
                  <div className="hover-actions-container" key={i}>
                    <div className="hover-actions">
                      <Button icon="download" onClick={() => saveCard(x.html, x.css, ratio)} >
                        Download
                      </Button>
                    </div>
                    <div style={{display: 'inline'}} dangerouslySetInnerHTML={{__html: x.html}}/>
                  </div>                    
                ))}
              </div>              
            </div>
          </div>
          <div className={Classes.DRAWER_FOOTER}>
            <div className="row">
              <div className="col">
                <Label>
                  Card Back Placement
                  <HTMLSelect value={cardBackSettings} onChange={e => { setCardBackSettings(e.target.value); updateRenderInfo(e.target.value); }}>
                    <option value={CardBackSettings.NONE}>Don't Render Backs</option>
                    <option value={CardBackSettings.FIRST}>Only Render The First Back</option>
                    <option value={CardBackSettings.AFTER}>Render Backs after Faces</option>
                    <option value={CardBackSettings.COLLATE}>Collate Card Faces and Backs</option>
                  </HTMLSelect>
                </Label>
              </div>
              <div className="col">
                <Label>
                  Image Scale
                  <NumericInput value={ratio} onValueChange={setRatio} leftIcon="maximize"/>
                </Label>
              </div>
              <div className="col">
                <Label>
                  &nbsp;
                  <Button icon="download" text="Download as Zip File" onClick={generateZip} className="flex" />
                </Label>
              </div>              
            </div>
          </div>
        </Drawer>
      </section>
    );
  });
}

const configEntitySelect = <T extends IEntity>(
  store: EntityStore<T>,
  onItemSelect: (item: T) => void,
  currentItem: T|undefined
): JSX.Element => {
  const EntitySelect = Select.ofType<T>();

  return (
    <EntitySelect
      items={store.items}
      itemRenderer={defaultEntityItemRenderer}
      noResults={<MenuItem disabled={true} text="None Available" />}
      onItemSelect={onItemSelect}
      activeItem={currentItem}
    >        
      <Button text={currentItem?.name || 'Nothing Selected'} rightIcon="double-caret-vertical" />
    </EntitySelect>
  )
};