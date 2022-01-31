const { execSync } = require('child_process');

const sleep = (seconds) => new Promise((resolve => setTimeout(() => resolve(), seconds * 1000)))
const random = (min,max) => { return Math.floor((Math.random())*(max-min+1))+min; }

function executeAction(actionName, actionData, actor, contract) {
	console.log(`executing ${contract}:${actionName} for ${actor}`);

	var transaction = {
		actions: [{
			account: contract,
			name: actionName,
			authorization: [{
				actor: actor,
				permission: "active",
			}],
			data: actionData,
		}]
	}

	let commandArray = [
		'uxcli',
		'eosio:sign',
		'--chainid "8fc6dce7942189f842170de953932b1f66693ad3788f766e777b6f9d22335c02"',
		'--key "EOS8NxVcvaYA5YkYDSwizUK6MRWQWViiUWXhutDYGCbwa21fHdDog"',
		`--tx '${JSON.stringify(transaction)}'`,
		`--permission "${actor}@active"`,
		'--broadcast'
	]
	try {
		let result = execSync(commandArray.join(' '), {stdio: ['inherit']}) || Buffer.from('{"data":""}');
		return JSON.parse(result.toString()).data;
	} catch(e) {
		return {"error": e.toString()};
	}
}

const getAccount = (username) => {
	let commandArray = [
		"uxcli",
		"eosio:fetch",
		"--server https://explorer.uxnetwork.io",
		"--endpoint '/v1/chain/get_account'",
		`--data '{"account_name":"${username}"}'`
	]
	try {
		let result = execSync(commandArray.join(' '), {stdio: ['inherit']}) || Buffer.from('{"data":""}');
		return JSON.parse(result.toString()).data;
	} catch(e) {
		return {"error": e.toString()};
	}
}

const getTableRows = (contract, table, scope) => {
	let payload = {
	  "code": contract,
	  "table": table,
	  "scope": scope,
	  "limit": -1,
	  // "index_position": "string",
	  // "key_type": "string",
	  // "encode_type": "string",
	  // "lower_bound": "string",
	  // "upper_bound": "string",
	  // "reverse": false,
	  // "show_payer": false
	}

	let commandArray = [
		"uxcli",
		"eosio:fetch",
		"--server https://explorer.uxnetwork.io",
		"--endpoint '/v1/chain/get_table_rows'",
		`--data '${JSON.stringify(payload)}'`
	]
	try {
		return JSON.parse(execSync(commandArray.join(' '), {stdio: ['inherit']}).toString()).data;
	} catch(e) {
		return {"error": e.toString()};
	}
}

const getCurrencyBalance = (code, account, symbol) => {
	let commandArray = [
		"uxcli",
		"eosio:fetch",
		"--server https://explorer.uxnetwork.io",
		"--endpoint '/v1/chain/get_currency_balance'",
		`--data '${JSON.stringify({code, account, symbol})}'`
	]
	try {
		return parseFloat(JSON.parse(execSync(commandArray.join(' '), {stdio: ['inherit']}).toString()).data[0]);
	} catch(e) {
		return {"error": e.toString()};
	}
}

module.exports = { execSync, sleep, random, getAccount, getTableRows, getCurrencyBalance, executeAction };
