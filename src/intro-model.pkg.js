const initIntroModel = (level) => {
  return {
    'intro': {
      buttonText: 'Start!',
      title: 'Back to Skull Island',
      description: `<p>What if King Kong survived the fall off the Empire State Building? All he wants is to get back home to Skull Island.</p><p>The journey is long, and he's tired and hungry. The first thing to do is eat as much food as he can find. Then get off the island of Manhattan.</p>`,
      directions: `<p>Use the <b>arrow keys</b> or <b>WASD</b> to navigate. Fill up your health meter by eating food. Avoid police cars, and when you are done eating, find the Southern Pier.</p>`
    },
    'pre-lvl-2': {
      buttonText: 'Hitch a Ride!',
      title: 'Cross the Sea',
      description: '<p>The voyage back to Skull Island is much too long to swim by yourself. Hitch rides on passing boats, but watch out for planes flying over head. Hide underwater until they pass.</p>',
      directions: '<p>Unfortunately, we could not complete this portion of the game in time or space. Click through to the final level.</p>'
    },
    'pre-lvl-3': {
      buttonText: 'Fight!',
      title: 'Reclaim the Throne',
      description: `<p>King Kong has finally made it back to Skull Island. But someone else is in charge now.</p><p>Can he beat T-Rex to reclaim his spot as King?</p>`,
      directions: `<p>Use the <b>arrow</b> keys or <b>AD</b> to move left and right.</p> <p>Hold <b>Down</b> or <b>S</b> to block an attack.</p> <p>Hit <b>spacebar</b> or <b>click</b> to punch.</p>`
    },
    'credits': {
      title: 'Thanks for playing!',
      description: '<p>Back to Skull Island was created by Amy and Steven Frieson for the 2019 js13kgames competition.</p><p>Sorry we couldn\'t get to level 2, but we thoroughly enjoyed making this game!</p>',
    }
  }[level];
};
