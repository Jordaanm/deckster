import { CardDesign, DataSet } from '../stores/types';
import { downloadZip } from 'client-zip';

const CARD_WIDTH = 320; //5px/mm
const CARD_HEIGHT = 445; //5px/mm

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

export const blobForSVG = (svg: string): Blob => {
  return new Blob([svg], {type: 'image/svg+xml;charset=utf-8'});
};

const createCanvas = (ratio: number): HTMLCanvasElement => {
  const canvas = document.createElement('canvas');

  canvas.height = CARD_HEIGHT;
  canvas.width = CARD_WIDTH;
  canvas.style.width  = canvas.width + "px";
  canvas.style.height = canvas.height + "px";

  canvas.width *= ratio;
  canvas.height *= ratio;

  return canvas;
}

export const renderBlobToCanvas = (blob: Blob, ratio: number): Promise<HTMLCanvasElement> => {

  return new Promise<HTMLCanvasElement>((resolve) => {
    const canvas = createCanvas(ratio);
    const ctx = canvas.getContext('2d');
    
    const fileReader = new FileReader();  
    fileReader.onload = (e: any) => {
      const img = new Image();
      const url = e.target.result;
      
      img.onload = function() {
        ctx?.drawImage(
          img,
          0, 0.,
          CARD_WIDTH, CARD_HEIGHT,
          0, 0,
          CARD_WIDTH * ratio, CARD_HEIGHT * ratio
        );
        resolve(canvas);
      }
  
      img.src = url; 
    }
    
    fileReader.readAsDataURL(blob);
  });
};

export const pngBlobFromSvgBlob = (blob: Blob, ratio: number):  Promise<Blob|null> => {
  return new Promise<Blob|null>((resolve) => {
    const canvas = createCanvas(ratio)
    const ctx = canvas.getContext('2d');
    
    const fileReader = new FileReader();
    
    fileReader.onload = (e: any) => {
      const img = new Image();
      const url = e.target.result;
      
      img.onload = function() {
        ctx?.drawImage(
          img,
          0, 0.,
          CARD_WIDTH, CARD_HEIGHT,
          0, 0,
          CARD_WIDTH * ratio, CARD_HEIGHT * ratio
        );
        canvas.toBlob(resolve, 'image/png', 1.0);
      }
  
      img.src = url;
  
    }
    fileReader.readAsDataURL(blob);
  });
};

export const triggerDownload = (imgURI: string, filename: string = 'card.png') => {
  var evt = new MouseEvent('click', {
    view: window,
    bubbles: false,
    cancelable: true
  });

  var a = document.createElement('a');
  a.setAttribute('download', filename);
  a.setAttribute('href', imgURI);
  a.setAttribute('target', '_blank');

  a.dispatchEvent(evt);
};

const renderCard = (template: string, datum: any) =>{
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

  return $el.outerHTML;
}

const toRenderInfo = (htmls: string[], css: string): RenderInfo[] => {
  return htmls.map(html => ({html, css}));
}

export const generateRenderInfo = (design?: CardDesign, backDesign?: CardDesign, dataSet?: DataSet, cardBackSettings: string = CardBackSettings.NONE): RenderInfo[] => {
  const data = dataSet?.data || [];
  const cardData = (data || []).map(datum => {
    const newDatum = {...datum };
    //Transform data by fieldMappings

    //Return transformed data;
    return newDatum;
  });
  
  const template = design?.code || '';
  const backTemplate = backDesign?.code || '';

  const frontCards = cardData.map(cdatum => renderCard(template, cdatum))

  let backCards: string[] = [];
  
  if (renderAllBacks.includes(cardBackSettings)) {
    backCards = cardData.map(cdatum => renderCard(backTemplate, cdatum))
  } else if (cardBackSettings === CardBackSettings.FIRST) {
    backCards = [renderCard(backTemplate, cardData[0])];
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

export const saveDeckToZip = async (renderInfo: RenderInfo[], ratio: number) => {
  const pngBlobPromises = renderInfo.map(ri => svgForCard(ri.html, ri.css))
  .map(svg => blobForSVG(svg))
  .map(blob => pngBlobFromSvgBlob(blob, ratio));

  const results = await Promise.all(pngBlobPromises);

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
};
