import * as React from 'react';
import { useObserver } from 'mobx-react-lite';
import { H2, EditableText, Button, ButtonGroup, MenuItem, Drawer, Classes } from '@blueprintjs/core';
import { GenerateConfig, CardDesign, DataSet, IEntity } from '../stores/types';
import { IStores } from '../stores/index';
import { useStores } from '../stores/util';
import { defaultEntityItemRenderer } from '../app/entity-select';
import { EntityStore } from '../stores/entity-store';
import { Select } from '@blueprintjs/select';
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

const buildSVGData = (html: string, css: string): string => {
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" class="playing-card">
      <foreignObject width="100%" height="100%">
        <div xmlns="http://www.w3.org/1999/xhtml">
          <style>${css}</style>
          ${html}
        </div>
      </foreignObject>
    </svg>`
  );
};

const saveCard = (html: string, css: string) => {
  const canvas: HTMLCanvasElement|null = document.getElementById('canvas') as HTMLCanvasElement|null;
  const DOMURL = window.URL || window.webkitURL || window;

  if(canvas) {
    var ctx = canvas.getContext('2d');
    const svgData = buildSVGData(html, css);

    var img = new Image();
    img.classList.add("playing-card");
    var svg = new Blob([svgData], {type: 'image/svg+xml;charset=utf-8'});
    var url = DOMURL.createObjectURL(svg);
    console.log("SVG URL", url);

    img.onload = function () {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      ctx?.drawImage(img, 0, 0, img.width, img.height);
      DOMURL.revokeObjectURL(url);
    }
    
    img.src = url;
  }
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

      setCardHtml(renderedCardData);
    };

    const openDrawer = () => {
      generateCardData();
      toggleDrawer();
    };

    return (
      <section className="row editor">
        <div className="f1 col">
          <div className="row">
            <H2><EditableText onChange={changeName} value={config.name} /></H2>
            <ButtonGroup>
              <Button icon="delete" text="Remove this Card Set" onClick={remove} />
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
              {cardHtml.map((x,i) => <div onClick={() => saveCard(x, design?.styles||'')} key={i} dangerouslySetInnerHTML={{__html: x}}/>)}
              <canvas id="canvas" className="playing-card"></canvas>
              <div dangerouslySetInnerHTML={{ __html: buildSVGData(cardHtml[0], design?.styles||'')}} />
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