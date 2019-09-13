"use strict";

/**
 * User sessions
 * @param {Array} users
 */
// const users = [];
let scores = [{n:'keith',s:15000},{n:'ken',s:12500},{n:'hans',s:10000}];


/**
 * Remove user session
 * @param {User} user
 */
// function removeUser(user) {
// 	users.splice(users.indexOf(user), 1);
// }



/**
 * User session class
 */
// class User {

// 	/**
// 	 * @param {Socket} socket
// 	 */
// 	constructor(socket) {
// 		this.socket = socket;
// 	}
// }

/**
 * Socket.IO on connect event
 * @param {Socket} socket
 */
module.exports = {

	io: (socket) => {
		// console.log(storage.size());
		if(storage.size()<=0) {
			console.log('initializing scores')
			storage.set('scores',scores);
		}
		
		// storage.clear();
		

		//  else {
		// 	storage.get('scores',scores).then(s=>{
		// 		console.log(s)
		// 	});
		// }
		// const user = new User(socket);
		// users.push(user);
		
		
		

		// socket.on("disconnect", () => {
		// 	console.log("Disconnected: " + socket.id);
		// 	// removeUser(user);
		// });

		socket.on("getScores", m => {
			// console.log('getting scores',scores)
			storage.get('scores',scores).then(s=>{
				// console.log(s);
				socket.emit('hiScores',s);
			});
		});
		socket.on('submitScore', s => {
			// console.log('score submitted',s)
			storage.get('scores',scores).then(hS => {
				if(storage.size()>13000)
					hS.pop();
				for(let i=0; i<hS.length; i++) {
					if(hS[i].s < s.s) {
						hS.splice(i,0,s);
						storage.set('scores',hS);
						socket.emit('place',[i,hS]);
						return;
					}
				}
				hS.push(s);
				storage.set('scores',hS);
				socket.emit('place',[hS.length-1,hS]);
			})
		});

		// console.log("Connected: " + socket.id);
	}

	// stat: (req, res) => {
	// 	storage.get('games', 0).then(games => {
	// 		res.send(`<h1>Games played: ${games}</h1>`);
	// 	});
	// }

};

// "use strict";let scores=[{n:'keith',s:15000},{n:'ken',s:12500},{n:'hans',s:10000}];module.exports={io:(socket)=>{if(storage.size()<=0)
// storage.set('scores',scores);socket.on("getScores",m=>{storage.get('scores',scores).then(s=>{socket.emit('hiScores',s)})});socket.on('submitScore',s=>{storage.get('scores',scores).then(hS=>{if(storage.size()>13000)
// hS.pop();for(let i=0;i<hS.length;i++){if(hS[i].s<s.s){hS.splice(i,0,s);storage.set('scores',hS);socket.emit('place',[i,hS]);return}}
// hS.push(s);storage.set('scores',hS);socket.emit('place',[hS.length-1,hS])})})}}