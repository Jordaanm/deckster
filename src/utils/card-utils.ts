import { CardDesign, DataSet, FieldTransformIds, TxStep } from '../stores/types';
import { ImageStore } from '../stores/image-store';
import { Project } from '../stores/project';
import { TransformStore } from '../stores/transform-store';
import * as TxOperations from '../transform/tx-ops';
const imageRegex = /!\[(\w*)(?:\|(.*))?\]/g;

export const PLAYING_CARD_CSS = `
*, *:before, *:after {  
  box-sizing: border-box;
}

.playing-card {
  height: 89mm;
  width: 64mm;
  font-size: 10mm;
}

foreignObject .playing-card {
  height: 100%;
  width: 100%;
}`;

export const CardBackSettings = {
  NONE: "NONE",
  FIRST: "FIRST",
  COLLATE: "COLLATE",
  AFTER: "AFTER"
};

const renderAllBacks = [
  CardBackSettings.AFTER,
  CardBackSettings.COLLATE
];

export interface RenderInfo {
  html: string,
  css: string
}

export const svgForCard = (html: string, css: string): string => {
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="320px" height="445px">
      <foreignObject x="0" y="0" width="320px" height="445px">
        <div xmlns="http://www.w3.org/1999/xhtml" style="width: 100%; height: 100%;">
         <style>${PLAYING_CARD_CSS}</style>
          <style>${css}</style>
          ${html}
        </div>
      </foreignObject>
    </svg>`
  );
};

const renderCard = (template: string, datum: any, imageStore: ImageStore) =>{
  //Render into template
  const $el = document.createElement("div");
  $el.classList.add("playing-card");
  $el.innerHTML = template || '';

  $el.querySelectorAll('[data-fieldid]').forEach(node => {
    const key = node.getAttribute("data-fieldid");
    if(key != null) {
      const value = datum[key];
      node.innerHTML = value;
    }
  });

  var result = $el.outerHTML;


  //Image Replacement
  var match = null;
  while ((match = imageRegex.exec(result)) !== null) {
    const [full, name, className] = match;
    const image = imageStore.items.find(x => x.name === name);
    if (image) {
      const replacement = `<img src="${image?.data}" class="${className||''}"/>`;
      result = result.replace(full, replacement);
    }
  }

  return result;
}

const toRenderInfo = (htmls: string[], css: string): RenderInfo[] => {
  return htmls.map(html => ({html, css}));
}

const getTxOperation = (txStep: TxStep) => {
  return Object.values(TxOperations).find(x => x.name === txStep.operation.name);
}

const applyTransform = (object: any, field: string, transformId: string, txStore: TransformStore) => {
  const transform = txStore.find(transformId);
  let value = object[field];
  if(typeof value === 'undefined') { return ''; }

  if(transform) {
    transform.steps.forEach(txStep => {
      const actualOp = getTxOperation(txStep);
      if(actualOp) {
        value = actualOp.pipe(value, txStep.params);
      }
    });
    object[field] = value;
  }
}

export const generateRenderInfo = (design: CardDesign|undefined, backDesign: CardDesign|undefined, dataSet: DataSet|undefined, fieldTx: FieldTransformIds[], cardBackSettings: string, project: Project): RenderInfo[] => {
  const imageStore = project.images;
  const txStore = project.transforms;

  const data = dataSet?.data || [];
  const cardData = (data || []).map(datum => {
    const newDatum = {...datum };
    //Transform data by fieldMappings
    fieldTx.forEach(fieldTransform => {
      const {field, transform} = fieldTransform;
      applyTransform(newDatum, field, transform, txStore);
    });

    //Return transformed data;
    return newDatum;
  });
  
  const template = design?.code || '';
  const backTemplate = backDesign?.code || '';

  const frontCards = cardData.map(cdatum => renderCard(template, cdatum, imageStore))

  let backCards: string[] = [];
  
  if (renderAllBacks.includes(cardBackSettings)) {
    backCards = cardData.map(cdatum => renderCard(backTemplate, cdatum, imageStore))
  } else if (cardBackSettings === CardBackSettings.FIRST) {
    backCards = [renderCard(backTemplate, cardData[0], imageStore)];
  }
  
  const frontRenderInfo = toRenderInfo(frontCards, design?.styles || '');
  const backRenderInfo = toRenderInfo(backCards, backDesign?.styles || '');


  return intertwine(cardBackSettings, frontRenderInfo, backRenderInfo);

};

const intertwine = (cardBackSettings: string, front: RenderInfo[], back: RenderInfo[]): RenderInfo[] => {
  switch(cardBackSettings) {
    case CardBackSettings.NONE: return front;
    case CardBackSettings.FIRST: return [...front, back[0]];
    case CardBackSettings.AFTER: return [...front, ...back];
    case CardBackSettings.COLLATE: return front.flatMap((f, i) => [f, back[i]]);
    default: return [];
  }
};
