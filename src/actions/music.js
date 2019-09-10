import Sequence from './../../lib/TinyMusic.js';
// create a new Web Audio API context
var ac = new AudioContext();
let currentSequence;

let generateSequence = function(noteList, tempo) {
	let notes = [];
	noteList.map(n => {
		notes.push(`${n.n} ${n.len}`);
	});
	let sequence = new Sequence(ac, tempo, notes);
	sequence.loop = false;
	sequence.staccato = 0.5;
	sequence.gain.gain.value = 0.5;
	sequence.createCustomWave([-0.8, 1, 0.8, 0.8, -0.8, -0.8, -1]);
	return sequence;
}

let MusicActions = {
	playMusic: function(noteList, tempo, cb) {
		if (currentSequence) {
			currentSequence.stop();
		}
		currentSequence = generateSequence(noteList, tempo);
		
		currentSequence.play(ac.currentTime + ( 60 / tempo ));
	},

	stopMusic: function() {
		if (currentSequence) {
			currentSequence.stop();
		}
	}
};

export default MusicActions;