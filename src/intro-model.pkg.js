const initIntroModel = (level) => {
  const levels = {
    'intro': {
      buttonText: 'Start!',
      title: 'Back to Skull Island',
      instructions: 'Here is how to play the game.'
    },
    'pre-lvl-2': {
      buttonText: 'Hitch a Ride!',
      title: 'You made it out of New York.',
      instructions: 'Go across the sea back to Skull Island.'
    },
    'pre-lvl-3': {
      buttonText: 'Fight!',
      title: 'Reclaim the Throne',
      instructions: 'You\'ve made back to Skull Island. Can you beat T-Rex to reclaim your spot as King Kong.'
    },
    'credits': {
      title: 'Thanks for playing!',
      instructions: 'Back to Skull Island was created by Amy and Steven Frieson for the 2019 js13kgames competition.'
    }
  };



  return levels[level];
};
