import Sequence from './../../lib/TinyMusic.js';
// create a new Web Audio API context
// var ac = new AudioContext();
let seq;

let MusicActions = {
	playMusic: function(nl, tempo) {
		if (seq) {
			seq.stop();
		}
		seq = new Sequence(null, tempo, nl);
		seq.loop = false;
		seq.staccato = 0.5;
		seq.gain.gain.value = 0.5;
		seq.createCustomWave([-0.8, 1, 0.8, 0.8, -0.8, -0.8, -1]);
		seq.play();
	},

	stopMusic: function() {
		if (seq) {
			seq.stop();
		}
	}
};

export default MusicActions;