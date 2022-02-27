import {
	cli,
	sleep,
	getTableRows,
	executeAction,
	getCurrencyBalance,
} from '../shared/functions.js';

async function run(username) {
	try {
		let res;
		let timestamp = new Date();
		if(timestamp.getUTCHours() === 0 && 0 <= timestamp.getUTCMinutes() <= 15) {
			let resaccpayQuery = await getTableRows("eosio", "resaccpay", "eosio");
			let foundBalance = resaccpayQuery.data.rows.find((x) => x.account === username);
			if ( foundBalance ) {
				await executeAction("claimdistrib", {"account": username}, username, "eosio");
				let pendingBalance = await getCurrencyBalance(username, "eosio.token", "UTX");
				await executeAction("delegatebw", {
			        "from": username,
			        "receiver": username,
			        "stake_net_quantity": "0.0000 UTX",
			        "stake_cpu_quantity": pendingBalance.data[0],
			        "transfer": 0
				}, username, "eosio");
			}
		}

		res = await executeAction("zx", {}, username, "genesis111hf");
		if(res.error && res.error.includes("deadline exceeded")) {
			console.log('deadline exceeded');
			run(username);
		} else if(res.error && res.error.includes("billed CPU time")) {
			console.log('not enough CPU')
			await sleep(120); run(username);
		} else {
			console.log(`executed - (${Date.now()})`)
			run(username);
		}
		// await sleep(1); run(username);
	} catch(e) {
		console.log(e);
		if(e.toString().includes("store not open")) process.exit();
		await sleep(1); run(username);
	}
}

run(process.argv[2]);
