import { sleep, random, signWithUX } from '../shared/functions.js';

let username = "manual111111";

async function runGame() {
	await executeAction("login", {}, username);
	await executeAction("startgame", {}, username);
	while (true) {
		try {
			await executeAction(("playcard", {}, username);
			await executeAction(("nextround", {}, username);
			await sleep(random(3,15))
		} catch(e) {
			if(e.toString().indexOf("This game has ended. Please start a new on") !== -1) {
				console.log("    --> success")
				await executeAction(("endgame", {}, username);
			} else { console.log({error: e.toString()}) }
			break;
		}
	}
	await runGame();
}

(async () => {
	await runGame();
})();
