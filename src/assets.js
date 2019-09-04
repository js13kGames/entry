import { objMap } from './util2';

export default function Assets(assets) {

  const cache = {};
  const total = Object.keys(assets).length;

  let progress = 0;

  this.progress = () => progress;

  this.get = (key) => cache[key];

  this.start = () => {
    return Promise.all(Object.values(
      objMap(assets, (key, source) => {
        return new Promise(resolve => {
          let img = new Image();
          img.onload = () => {
            resolve(img);
          };
          img.src = source;
        }).then(image => {
          cache[key] = image;
          progress++;
        });
      })))
      .then(_ => cache);
  };

}

