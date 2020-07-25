export const PLAYING_CARD_CSS = `
.playing-card {
  height: 89mm;
  width: 64mm;
  font-size: 10mm;
}
`;

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