const bip32 = require('bip32');
const bip39 = require('bip39');
const bitcoin = require('bitcoinjs-lib');

const mnemonic =
  'hello world world world world world world world world world world hello';
const seed = bip39.mnemonicToSeedSync(mnemonic);
const root = bip32.fromSeed(seed);

const path = "m/49'/1'/0'/0/0";
const child = root.derivePath(path);

const { address } = bitcoin.payments.p2sh({
  redeem: bitcoin.payments.p2wpkh({
    pubkey: child.publicKey,
    network: bitcoin.networks.testnet,
  }),
  network: bitcoin.networks.testnet,
});

console.log(`address is: ${address}`);