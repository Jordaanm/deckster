
export const CARD_WIDTH = 320; //5px/mm
export const CARD_HEIGHT = 445; //5px/mm

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
};

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
