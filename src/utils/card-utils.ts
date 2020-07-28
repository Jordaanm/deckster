import { CardDesign, DataSet } from '../stores/types';
export const PLAYING_CARD_CSS = `
.playing-card {
  height: 89mm;
  width: 64mm;
  font-size: 10mm;
}
`;

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

export const buildSVGData = (html: string, css: string): string => {
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="640" height="890" viewbox="0 0 320 445">
      <foreignObject x="0" y="0" width="640" height="890">
        <div xmlns="http://www.w3.org/1999/xhtml" style="width: 100%; height: 100%;">
          <style>${css}</style>
          <style>${PLAYING_CARD_CSS}</style>
          ${html}
        </div>
      </foreignObject>
    </svg>`
  );
};

export const svgBlobForCard = (html: string, css: string): Blob => {
  const svgData = buildSVGData(html, css);
  var blob = new Blob([svgData], {type: 'image/svg+xml;charset=utf-8'});

  return blob;
};

type DataUrlCallback = (uri: string) => void;

export const dataUrlFromImageBlob = (callback: DataUrlCallback) => (blob: Blob) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  const fileReader = new FileReader();
  
  fileReader.onload = (e: any) => {
    const img = new Image();
    const url = e.target.result;

    img.onload = function() {
      ctx?.drawImage(img, 0, 0);
      var imgURI = canvas
        .toDataURL('image/png')
        .replace('image/png', 'image/octet-stream');

      callback(imgURI);
    }

    img.src = url;

  }
  fileReader.readAsDataURL(blob);
};

export const pngBlobFromSvgBlob = (blob: Blob):  Promise<Blob|null> => {
  return new Promise<Blob|null>((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    const fileReader = new FileReader();
    
    fileReader.onload = (e: any) => {
      const img = new Image();
      const url = e.target.result;
  
      img.onload = function() {
        ctx?.drawImage(img, 0, 0);
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


export const generateCardData = ( design?: CardDesign, data?: any[]) => {

  //For each row of the data set
  const cardData = (data || []).map(datum => {
    const newDatum = {...datum };
    //Transform data by fieldMappings

    //Return transformed data;
    return newDatum;
  });

  const template = design?.code || '';

  const renderedCardData = cardData.map(cdatum => renderCard(template, cdatum));

  return renderedCardData;
};