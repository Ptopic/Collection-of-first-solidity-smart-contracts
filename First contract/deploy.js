const HDWalletProvider = require('@truffle/hdwallet-provider');
const { Web3 } = require('web3');
const { interface, bytecode } = require('./compile');
require('dotenv').config();

// deploy code will go here

const provider = new HDWalletProvider(
	process.env.NEUMONIC,
	'https://sepolia.infura.io/v3/a84f1ad53c5844aab609709f988f7fe2'
);

const web3 = new Web3(provider);

const deployContract = async () => {
	const accounts = await web3.eth.getAccounts();

	const deployResult = await new web3.eth.Contract(JSON.parse(interface))
		.deploy({
			data: bytecode,
			arguments: ['Hi there!'],
		})
		.send({ gas: '1000000', from: accounts[0] });

	console.log('Contract deployed to: ', deployResult.options.address);
};

deployContract();
