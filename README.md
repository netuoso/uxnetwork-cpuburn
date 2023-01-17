# UXNetwork CPU Burn Spam Script

## Description:
- Use this script to automatically burn all your accounts CPU resources on the UXNetwork in order to manipulate the chain to distribute more UTX inflation tokens to your account.

## Setup:
- `git clone https://github.com/netuoso/uxnetwork-cpuburn`
- `cd uxnetwork-cpuburn`
- `npm install`
- `npx trunxcli service:start`
- `npx trunxcli config:init`
- `npx trunxcli db:unlock -p WALLETPASSWORD`
- `npx trunxcli chains:add https://explorer.uxnetwork.io`
- `npx trunxcli keys:add PRIVKEY`

## Running:
- `npm run cpuburn -- ACCOUNTNAME ACTIVE_PUBKEY`

## Notes:
- Replace `WALLETPASSWORD` above with a custom password to lock your wallet with
- Replace `PRIVKEY` with the private key for your account's ACTIVE auth
- If successful script starts infinite loop outputting logs to console
- If error, script immediately exits
	- To debug, uncomment Line 7 and Line 35 in `shared/functions.js`