// @ifdef DEBUG
let fpsTextNode: Text;
let msTextNode: Text;
let frameCount: number = 0;
let fps: number = 60;
let lastFps: number = 0;
let ms: number = 1000 / fps;

function _initFps(): void {
    const container: HTMLDivElement = document.createElement("div");
    container.style.position = "relative";
    document.body.prepend(container);

    const overlay: HTMLDivElement = document.createElement("div");
    overlay.style.position = "absolute";
    overlay.style.left = "10px";
    overlay.style.top = "10px";
    overlay.style.fontFamily = "monospace";
    overlay.style.padding = "1em";
    overlay.style.color = "white";
    container.appendChild(overlay);

    const fpsDOM: HTMLDivElement = document.createElement("div");
    overlay.appendChild(fpsDOM);
    const msDOM: HTMLDivElement = document.createElement("div");
    overlay.appendChild(msDOM);

    fpsTextNode = window.document.createTextNode("");
    fpsDOM.appendChild(fpsTextNode);
    msTextNode = window.document.createTextNode("");
    msDOM.appendChild(msTextNode);
}

function _tickFps(delta: number, now: number): void {
    ms = 0.9 * delta + 0.1 * ms;
    if (now >= lastFps + 1000) {
        fps = 0.9 * frameCount * 1000 / (now - lastFps) + 0.1 * fps;

        fpsTextNode.nodeValue = (~~fps).toString();
        msTextNode.nodeValue = ms.toFixed(2);

        lastFps = now - (delta % 1000 / 60);
        frameCount = 0;
    }
    frameCount++;
}
// @endif
