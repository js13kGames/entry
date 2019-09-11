GameContainer.setLevels([
  {
    level: 0,
    text: {
      "table-text": "Welcome to Action Hero Training Week!\n\nToday's lesson is aiming and shooting behind your back. One day, you WILL be chasing a creepy and mysterious enemy through a mirror maze. After today, you'll be prepared.\n\nThe rear-view helmet you're wearing can be activated by the button on the wall. Once you've cleared the lesson, you'll be able to deactivate it and return to your normal view.\n\nThere is an emergency button at your feet but you'll need to retry that lesson. Good luck."
    },
    onSpin: function() {
      GameContainer.setText({"wall-hint": "Achievement Unlocked\nEyes in the Back of Your Head"});
    }
  }
]);
