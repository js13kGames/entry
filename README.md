# VR Backwards Shooting Range

> [js13k 2019](https://2019.js13kgames.com/) entry

## Thank You

- [js13k](https://2019.js13kgames.com/), of course.
- [Mozilla's AFrame](https://aframe.io).
- and my wife for getting me a DK1 all those years ago.

## Plan

1. Finish before deadline
1. Release and tag submitted version
1. Expand documentation

## Premise

Coming soon

## TIL

### WebVR on Oculus Quest

1. Install Firefox Reality
1. Go to URL
1. Bookmark

To refresh page from fullscreen (annoying)

1. Oculus Home
1. Resume Firefox
1. Hit refresh
1. Return to fullscreen

### Oculus Quest Debugging

I couldn't find any official way to get debugging info from the Oculus Quest since it only connects over Wi-Fi (if at all) and the SteamVR logs don't pick up anything.

So I dropped a text element into the world and used that as my string log. You can put this element inside the camera if you want it to be visible as a UI element, but I didn't do that.

```html
<a-text id="log" value="Hello!" color="#000" align="center" position="0 2 -5"></a-text>
```

```javascript
const logEl = document.getElementById("log");
function log(msg) {
  logEl.setAttribute("value", msg);
}

// For updating messages
function debug() {
  requestAnimationFrame(debug);
  log(blueGun.object3D.matrix.toArray().join(","));
}
requestAnimationFrame(debug);

// For everything else
try {
  // do a backflip
} catch(e) {
  log(e);
}
```

### Move the World, Not the Camera

I have a few game concepts that involve pulling the player along or changing their view but trying to override the default WebVR camera is a pain.

If you do manage to get control of the camera (either with groups or with rigs) you need to then manually ensure you draw both eye "cameras" anyway. It's just more work that it's worth when you can move the whole world instead!

A heirachy like this makes this quite easy to do:

```
- scene
  - camera
  - hand controllers
  - world
    - all physical items
    - (put hands in here if you want to manipulate them like I do)
```

### Controllers

Coming soon