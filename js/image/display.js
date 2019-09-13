/*
This is where unpacked image-strings get displayed.
*/
function imgIndex(input){
  return Math.floor(frame/6 % input);
}

// displaystringloop()
// display image from an image loop according to current frame.

function displayStringLoop(input,x,y,w,stretch,dir){

  // pick which image to display
  let index = imgIndex(input.length);

  // inputs:

  displayImage(
    input[index].a, // a = unpacked pixels array
    input[index].c, // c = color values array
    x,y, //  top-left corner x,y position
    w, // original image width
    stretch, // pixel stretch (width&height of each pixel)
    dir // direction. 1 is normal, -1 is reversed on the x axis.
  );
}


// displayimage()
// see inputs description above.
// displays an image by drawing out a fillRect for each pixel.

function displayImage(input,c,x,y,w,stretch,dir){

  ctx = canvas.context;

  // for each pixel
    ctx.beginPath();
  for(let i=0; i<input.length; i++){

    if(c[input[i]]!=false){

      if(i>trace) { // "tracing" effect:
        trace=i;    // stop drawing before this next pixel if its index value matches
        return;     // the current "trace" value. "trace" gets incremented
      }             // in the main game loop and is reset on screen changes.
                    // that way images are drawn from top to bottom when they first appear.


      ctx.fillStyle = c[input[i]];
      let fact = 0
      if(dir===-1) fact=w*stretch; // var fact is used to reverse the image as needed

        ctx.fillRect( // draw this pixel
          x+ fact  +dir*(i%w)*stretch,
          y+Math.floor(i/w)*stretch,
          dir*(stretch+0.5),
          stretch+0.5
        );


    }
  }
  ctx.closePath();
}
