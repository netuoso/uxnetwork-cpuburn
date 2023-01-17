# UXNetwork CPU Burn Spam Script

## Description:
- Use this script to automatically burn all your accounts CPU resources on the UXNetwork in order to manipulate the chain to distribute more UTX inflation tokens to your account.

## Quick Start:
- `git clone https://github.com/netuoso/uxnetwork-cpuburn`
- `cd uxnetwork-cpuburn`
- `npm install`
- `npx trunxcli service:start`
- `npx trunxcli config:init`
- `npx trunxcli db:unlock -p WALLETPASSWORD`
- `npx trunxcli chains:add https://explorer.uxnetwork.io`
- `npx trunxcli keys:add PRIVKEY`

## Notes:
- Replace `WALLETPASSWORD` above with a custom password to lock your wallet with
- Replace `PRIVKEY` with the private key for your account's ACTIVE auth