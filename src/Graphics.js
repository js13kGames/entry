export let Canvas = document.querySelector('canvas')
export let Graphics = Canvas.getContext('2d')

// Closure Compiler would rename the property if we don't set it like this
Graphics['imageSmoothingEnabled'] = false
