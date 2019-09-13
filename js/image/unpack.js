// unpackimage()
// breaks down a string representation of an image into an array of numbers
// that can more easily be displayed in game. this should be called in setup.

function unpackImage(input){

  // step 1
  // convert characters to char codes and separate the two resulting digits.
  // the first digit represents a color value in the image's corresponding colors array,
  // and the second digit represents the number of pixels of the same color that follow.

  let bunched = [];
  for(let i=0; i<input.length; i++){
    bunched.push({
      type: Math.floor((input.charCodeAt(i)-40)/10),
      add: (input.charCodeAt(i))%10
    });
  }

  // step 2
  // fully unpack the array by creating 1 entry per pixel.

  let unpacked = [];
  for(let i=0; i<bunched.length; i++){
    unpacked.push( bunched[i].type );
    for(let j=0; j<bunched[i].add; j++){
      unpacked.push( bunched[i].type );
    }
  }

  // return result.
  return unpacked;
}

// unpackimgloop()
// run unpackImage for each image in an array of images.

function unpackImgLoop(input){
  for(let i=0; i<input.length; i++){
    input[i].a = [];
    input[i].a = unpackImage(input[i].s);
  }
}

// unpack3()
// unpack an array of 3-image animation loops and add a copy of the second frame at the end of each.
// turns out many of my animation loops needed that so this saves a few characters.

function unpack3(input){
  for(let i=0; i<input.length; i++){
    unpackImgLoop(input[i]);
    input[i].push(input[i][1]);
  }
}

  // unpackall()
  // unpack all images on preload.
  // add corresponding colors where necessary.

function unpackAll(){

  pushCol(jumpCol,jumpLoop);
  pushCol(sleepCol,sleepLoop);
  pushCol(stillCol,stillLoop);
  pushCol(babyCol,babyWalkLoop);
  pushCol(babyCol,babyCarriedLoop);
  pushCol(sunCol,sunLoop);

  unpackImgLoop(tigerWalkLoop);
  unpackImgLoop(walkLoop);
  unpackImgLoop(trees);

  unpack3([babyCarriedLoop,jumpLoop,stillLoop,sleepLoop,birdStillLoop,tigerJumpLoop,sunLoop])

  unpackImgLoop(birdFlapLoop);
  birdFlapLoop.push(birdFlapLoop[2]);
  birdFlapLoop.push(birdFlapLoop[1]);

  unpackImgLoop(babyWalkLoop);
  babyWalkLoop.push(babyWalkLoop[2]);
  babyWalkLoop.push(babyWalkLoop[1]);

  groundImg.a = unpackImage(groundImg.s);
  bgImage.a = unpackImage(bgImage.s);
  homeImg.a = unpackImage(homeImg.s);
  cloudImg.a = unpackImage(cloudImg.s);

  // format alphabet array, as the letters array contained only strings
  for(let i=0; i<letters.length; i++){
    alphabet[i] = {s:letters[i],c:[false,c[1]],w:5};
  }
  unpackImgLoop(alphabet);
}
