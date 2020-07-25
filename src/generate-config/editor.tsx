import * as React from 'react';
import { useObserver } from 'mobx-react-lite';
import { H2, EditableText, Button, ButtonGroup, MenuItem, Drawer, Classes } from '@blueprintjs/core';
import { GenerateConfig, CardDesign, DataSet, IEntity } from '../stores/types';
import { IStores } from '../stores/index';
import { useStores } from '../stores/util';
import { defaultEntityItemRenderer } from '../app/entity-select';
import { EntityStore } from '../stores/entity-store';
import { svgBlobForCard, dataUrlFromImageBlob, triggerDownload, PLAYING_CARD_CSS, buildSVGData, pngBlobFromSvgBlob } from '../utils/card-utils';
import { Select } from '@blueprintjs/select';
import { downloadZip, InputWithMeta, InputWithoutMeta } from 'client-zip';

interface GenConfigEditorProps {
  config?: GenerateConfig;
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

export const GenConfigEditor: React.FC<GenConfigEditorProps> = (props) => {

  const stores: IStores = useStores();
  const { project } = stores;
  const [showDrawer, setShowDrawer] = React.useState<Boolean>(false);
  const [cardHtml, setCardHtml] = React.useState<string[]>([]);

  return useObserver(() => {
    const { config } = props;


    if (!config) { return null; }
    
    const toggleDrawer = () => setShowDrawer(!showDrawer);

    const changeName = (text: string) => { if(config) { config.name = text; }};
    const setDesign = (design: IEntity) => { config.cardDesign = design.id; }
    const setDataSet = (dataSet: IEntity) => { config.dataSet = dataSet.id; }
    const remove = () => project.generateConfigs.remove(config.id);

    const dataSet: DataSet|undefined = project.datasets.find(config.dataSet || undefined);
    const design: CardDesign|undefined = project.designs.find(config.cardDesign || undefined);

    const generateCardData = () => {

      //For each row of the data set
      const cardData = (dataSet?.data || []).map(datum => {
        const newDatum = {...datum };
        //Transform data by fieldMappings

        //Return transformed data;
        return newDatum;
      });

      const renderedCardData = cardData.map(cdatum => {
        //Render into template
        const $el = document.createElement("div");
        $el.classList.add("playing-card");
        $el.innerHTML = design?.code || '';
        $el.querySelectorAll('[data-fieldid]').forEach(node => {
          const key = node.getAttribute("data-fieldid");
          console.log("Found a field", node, key, cdatum[key||'']);
          if(key != null) {
            const value = cdatum[key];
            node.innerHTML = value;
          }
        });

        return $el.outerHTML;
      });

      return renderedCardData;
    };

    const openDrawer = () => {
      const cardData = generateCardData();
      setCardHtml(cardData);
      toggleDrawer();
    };

    const generateZip = () => {
      const cardData = generateCardData();
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
            {configEntitySelect<CardDesign>(project.designs, setDesign, design)}
          </div>
          <div className="row">         
            {configEntitySelect(project.datasets, setDataSet, dataSet)}
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
              <style dangerouslySetInnerHTML={{__html: PLAYING_CARD_CSS}} />
              {cardHtml.map((x,i) => <div onClick={() => saveCard(x, design?.styles||'')} key={i} dangerouslySetInnerHTML={{__html: x}}/>)}
              <div className="playing-card" dangerouslySetInnerHTML={{ __html: buildSVGData(cardHtml[0], design?.styles||'')}} />
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