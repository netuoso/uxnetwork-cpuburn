const { fork } = require('child_process');

const sleep = (seconds) => new Promise((resolve => setTimeout(() => resolve(), seconds * 1000)))
const random = (min,max) => { return Math.floor((Math.random())*(max-min+1))+min; }

function cli(options){
  // console.log("cli params", options)
  let command = require('path').resolve(__dirname, '..', 'node_modules', '@trunx-io', 'cli', 'bin', 'run');

  return new Promise((resolve, reject) =>{
    let forked = fork( command, options || [], { stdio:"pipe" } );
    let stdOutArr = []

    forked.stdout.on("data", data => {
      try{
        let output = JSON.parse(data);
        resolve(output);
      }catch(ex){
        // build stdout array that will be returned on process exit
        let formatted = data.toString().split(/[\r\n|\n|\r]/).filter(String);
        stdOutArr.push(...formatted)
      }
    });
    forked.on("exit", code => {
      if(stdOutArr.length) {
        try {
          // attempt to parse chunked JSON sent above
          resolve(JSON.parse(stdOutArr.join('')))
        } catch(ex) {
          resolve(stdOutArr)
        }
      }
    });
    forked.stderr.on("data", error => {
    	// console.log(error.toString())
    	if(error.toString().includes("FetchError") || error.toString().includes("store not open")) {
    		reject(error.toString());
    	}
    });
  });
}

function unlock(password) {
	let commandArray = [
		'db:unlock',
		'-p',
		password
	]
	return cli(commandArray);
}

function executeAction(actionName, actionData, actor, contract, pubkey) {
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
		'eosio:sign',
		'--chainid', "8fc6dce7942189f842170de953932b1f66693ad3788f766e777b6f9d22335c02",
		'--key', pubkey,
		'--tx', JSON.stringify(transaction),
		'--permission', `${actor}@active`,
		'--broadcast'
	]
	return cli(commandArray);
}

const getAccount = (username) => {
	let commandArray = [
		"eosio:fetch",
		"--server", "https://explorer.uxnetwork.io",
		"--endpoint", "/v1/chain/get_account",
		"--data", JSON.stringify({account_name: username})
	]
	return cli(commandArray);
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
		"eosio:fetch",
		"--server", "https://explorer.uxnetwork.io",
		"--endpoint", '/v1/chain/get_table_rows',
		"--data", JSON.stringify(payload)
	]
	return cli(commandArray);
}

const getCurrencyBalance = (account, code, symbol) => {
	let commandArray = [
		"eosio:fetch",
		"--server", "https://explorer.uxnetwork.io",
		"--endpoint", '/v1/chain/get_currency_balance',
		"--data", JSON.stringify({code, account, symbol})
	]
	return cli(commandArray);
}

module.exports = { sleep, unlock, getAccount, getTableRows, getCurrencyBalance, executeAction };
