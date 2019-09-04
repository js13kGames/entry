function playMusic () {
  var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const masterGain = audioCtx.createGain();
  masterGain.gain.value = 0.5;

  let lastScheduledNote = {
    drum: 1,
    synth: 1
  }

  function makeNote(startTime, freq, sweepLength, wave) {
    var oscillator = audioCtx.createOscillator();
    oscillator.type = wave;

    let sweepEnv = audioCtx.createGain();
    sweepEnv.gain.cancelScheduledValues(startTime);
    sweepEnv.gain.setValueAtTime(0, startTime);
    // set our attack
    sweepEnv.gain.linearRampToValueAtTime(0.5, startTime + 0.01);
    // set our release
    sweepEnv.gain.linearRampToValueAtTime(0, startTime + sweepLength - 0.5);

    oscillator.frequency.setValueAtTime(freq, startTime); // value in hertz
    oscillator.connect(sweepEnv).connect(masterGain).connect(audioCtx.destination);
    oscillator.start(startTime);
    oscillator.stop(startTime + sweepLength);
  }

  function makeDrumNote(startTime) {
    makeNote(startTime, 200, 1, 'sine');
  }

  function makeSynthNote(startTime) {
    const frequencies = [200, 236, 284, 300];
    makeNote(
      startTime,
      frequencies[floor(random() * frequencies.length)],
      random() * 10 + 1,
      'triangle'
    );
  }

  function getNextStartTime(interval, key) {
    return lastScheduledNote[key] + interval;
  }

  function scheduleNextNote(interval, makeSound, key) {
    const currentTime = audioCtx.currentTime;
    while ((currentTime + 2) > lastScheduledNote[key]) {
      const nextTime = getNextStartTime(interval, key);
      makeSound(nextTime);
      lastScheduledNote[key] = nextTime;
    }
  }

  function scheduleInstruments() {
    // drum
    scheduleNextNote(.5, makeDrumNote, 'drum');

    // generative
    const intervals = [.25, .5, .75, 1, 1.25, 1.5];
    scheduleNextNote(
      intervals[floor(random() * intervals.length)],
      makeSynthNote,
      'synth'
    );
  }

  setInterval(scheduleInstruments, 100);

  return true;
}
