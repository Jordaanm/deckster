import * as React from 'react';
import { useObserver } from 'mobx-react-lite';
import { H2, EditableText, Button, ButtonGroup, MenuItem, Drawer, Classes, Label, HTMLSelect } from '@blueprintjs/core';
import { Render, CardDesign, DataSet, IEntity } from '../stores/types';
import { IStores } from '../stores/index';
import { useStores } from '../stores/util';
import { defaultEntityItemRenderer } from '../app/entity-select';
import { EntityStore } from '../stores/entity-store';
import { svgBlobForCard, dataUrlFromImageBlob, triggerDownload, PLAYING_CARD_CSS, buildSVGData, pngBlobFromSvgBlob, generateCardData, CardBackSettings, RenderInfo, generateRenderInfo } from '../utils/card-utils';
import { Select } from '@blueprintjs/select';
import { downloadZip } from 'client-zip';

import './render.scss'

interface RenderEditorProps {
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

const saveCard = (html: string, css: string) => {
  var blob = svgBlobForCard(html, css);
  dataUrlFromImageBlob(uri => triggerDownload(uri))(blob);
};

const saveZip = async (htmlList: string[], css: string) => {
  const pngBlobPromises = htmlList
    .map(html => svgBlobForCard(html, css))
    .map(pngBlobFromSvgBlob);

  const results = await Promise.all(pngBlobPromises)
  const contents = results
    .map((blob: Blob|null, index: number) => {
    if(blob!= null) {
      return {
        name: `card${index}.png`,
        input: blob as Blob
      };
    } else {
      return null;
    }
  }).filter(x => x !== null);

  const blob = await downloadZip([...contents]).blob();
  const url = URL.createObjectURL(blob);

  triggerDownload(url, 'deck.zip');
  URL.revokeObjectURL(url);
}

export const RenderEditor: React.FC<RenderEditorProps> = (props) => {

  const stores: IStores = useStores();
  const { project } = stores;
  const [showDrawer, setShowDrawer] = React.useState<Boolean>(false);

  const [cardBackSettings, setCardBackSettings] = React.useState<string>(CardBackSettings.COLLATE);
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

    const openDrawer = () => {
      const renderInfo = generateRenderInfo(design, backDesign, dataSet, cardBackSettings);
      setCardRenderInfo(renderInfo);
      toggleDrawer();
    };

    const generateZip = () => {
      const cardData = generateCardData(design, dataSet?.data);
      saveZip(cardData, design?.styles||'');
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
                  <div className="hover-actions-container">
                    <div className="hover-actions">
                      <Button icon="download" onClick={() => saveCard(x.html, x.css)} >
                        Download
                      </Button>
                    </div>
                    <div style={{display: 'inline'}} dangerouslySetInnerHTML={{__html: x.html}}/>
                  </div>                    
                ))}
              </div>              
              {/* TESTING SVG RENDERING */}
              {
                cardRenderInfo.length > 0 &&
                <div className="playing-card" dangerouslySetInnerHTML={{ __html: buildSVGData(cardRenderInfo[0].html, design?.styles||'')}} />
              }
            </div>
          </div>
          <div className={Classes.DRAWER_FOOTER}>
            FOOTER
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