import cron from 'node-cron';
import {
	sleep,
	getAccount,
	getTableRows,
	getCurrencyBalance,
	executeAction,
} from '../shared/functions.js';

class Burner {
	constructor(username) {
		this.username = username;
		this.burncontract = "genesis111hf";

		this.refreshUserInfo();

		cron.schedule('*/3 * * * * *', this.burnCPU.bind(this));
		cron.schedule('01 * * * *', this.refreshUserInfo.bind(this));
		cron.schedule('05 0 * * *', this.claimAndStake.bind(this), { timezone: "UTC" });
	}

	refreshUserInfo() {
		executeAction("zy", {}, this.username, this.burncontract);
		this.userInfo = getAccount(this.username);
		this.cpuAvailable = (this.userInfo.cpu_limit.available / this.userInfo.cpu_limit.max) * 100;
	}

	claimAndStake() {
		if( getTableRows("eosio", "resaccpay", "eosio").rows.find((x) => x.account === this.username) ) {
			console.log(`${this.username} has pending inflation rewards to claim.\nClaiming and staking now...`);
			executeAction("claimdistrib", {"account": this.username}, this.username, "eosio");
			executeAction("delegatebw", {
		        "from": this.username,
		        "receiver": this.username,
		        "stake_net_quantity": "0.0000 UTX",
		        "stake_cpu_quantity": `${getCurrencyBalance("eosio.token", "eosio", "UTX")} UTX`,
		        "transfer": 0
			}, this.username, "eosio");
		} else {
			console.log(`${this.username} does not have pending inflation rewards to claim.`);
		}
	}

	burnCPU() {
		this.userInfo = getAccount(this.username);
		this.cpuAvailable = (this.userInfo.cpu_limit.available / this.userInfo.cpu_limit.max) * 100;
		if(this.cpuAvailable >= 5) executeAction("zx", {}, this.username, this.burncontract);
	}
}

(async () => {
	let burner1 = new Burner("genesis111hf");
	let burner2 = new Burner("manual111111");
})();
