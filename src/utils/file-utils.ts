import { RenderInfo, svgForCard } from './card-utils';
import {blobForSVG, pngBlobFromSvgBlob} from './render-utils';
import { downloadZip } from 'client-zip';

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
