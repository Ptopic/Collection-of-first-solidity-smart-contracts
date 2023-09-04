const HDWalletProvider = require('@truffle/hdwallet-provider');
const { Web3 } = require('web3');
const { abi, evm } = require('./compile');

require('dotenv').config();

const provider = new HDWalletProvider(
	process.env.NEUMONIC,
	'https://sepolia.infura.io/v3/a84f1ad53c5844aab609709f988f7fe2'
);

const web3 = new Web3(provider);

const deploy = async () => {
	const accounts = await web3.eth.getAccounts();

	console.log('Attempting to deploy from account', accounts[0]);

	const result = await new web3.eth.Contract(abi)
		.deploy({ data: evm.bytecode.object, arguments: ['Hi there!'] })
		.send({ gas: '1000000', from: accounts[0] });

	console.log('Contract deployed to', result.options.address);
	provider.engine.stop();
};
deploy();
