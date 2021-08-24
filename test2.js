const bip32 = require('bip32');
const bip39 = require('bip39');
const bitcoin = require('bitcoinjs-lib');

const testnet = bitcoin.networks.testnet;

function getAddress(node, network) {
	return bitcoin.payments.p2sh({
		redeem: bitcoin.payments.p2wpkh({ pubkey: node.publicKey, network }),
		network,
	}).address;
}

// This happens in the secure API
const mnemonic =
	'abandon test abandon abandon abandon abandon test abandon abandon abandon abandon about';
const seed = bip39.mnemonicToSeedSync(mnemonic);
const root = bip32.fromSeed(seed, testnet);

const accountpath = "m/49'/1'/0'"; // 1' is testnet, change to 0' for mainnet
const account = root.derivePath(accountpath);
const accountXPub = account.neutered().toBase58(); // testnet is tpub not xpub

// This happens in the less-secure webserver
// The webserver must not store private keys
const index = 1; // whatever

// The webserver gets the accountXPub on startup via an API call
// const accountXPub = axios.get(.../accountxpub);
const webRoot = bip32.fromBase58(accountXPub, testnet);
const webserverChild = webRoot
	.derive(0)
	.derive(index);

// console.log('webserverChild:', webserverChild)
// send the child's address to the user for payment
console.log('webserverChild address:', getAddress(webserverChild, testnet))


// The index gets sent together with the user's query to the API
// The API reconstructs the address, but it can also construct the private key
const APIChild = account
	.derive(0)
	.derive(index); // can now withdraw whatever the user paid
  
// console.log('APIChild:', APIChild);
console.log('APIChild address:', getAddress(APIChild, testnet));
console.log('APIChild.toWIF():', APIChild.toWIF())
