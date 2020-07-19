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

const saveCard = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
  const html = e.target as HTMLDivElement;
  console.log("HTML", html.outerHTML);
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
              {cardHtml.map((x,i) => <div onClick={saveCard} key={i} dangerouslySetInnerHTML={{__html: x}}/>)}
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