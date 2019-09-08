const initIntroModel = (level) => {
  return {
    'intro': {
      buttonText: 'Start!',
      title: 'Back to Skull Island',
      description: `<p>What if King Kong survived his fall off the Empire State Building? All he wants is to get back home to Skull Island.</p><p>The journey is long, and he's tired and hungry. The first thing to do is eat as much food as he can find. Then get off the island of Manhattan.</p>`,
      directions: `<p>Use the arrow keys or WASD to navigate.</p>`
    },
    'pre-lvl-2': {
      buttonText: 'Hitch a Ride!',
      title: 'Cross the Sea',
      description: 'Go across the sea back to Skull Island.',
    },
    'pre-lvl-3': {
      buttonText: 'Fight!',
      title: 'Reclaim the Throne',
      description: `<p>King Kong has finally made it back to Skull Island. But someone else is in charge now.</p><p>Can he beat T-Rex to reclaim his spot as King?</p>`,
      directions: `<p>Use the arrow keys or AD to move left and right.</p> <p>Hold Down or S to block an attack.</p> <p>Spacebar or click to punch.</p>`
    },
    'credits': {
      title: 'Thanks for playing!',
      description: 'Back to Skull Island was created by Amy and Steven Frieson for the 2019 js13kgames competition.',
    }
  }[level];
};
