class Scene {
  constructor(name, options) {
    this.name = name;
    this.O = options;
  }

  mount() {}

  unmount() {}
}

let currentScene = null;
let sceneMap = {};

export let mountScene = (name, data) => {
  if (currentScene) currentScene.unmount();

  currentScene = sceneMap[name];

  if (currentScene) currentScene.mount(data);
};

export let registerScene = (name, scene) => (sceneMap[name] = scene);

export default Scene;
