const assert = require('assert');
const ganache = require('ganache');
const { Web3 } = require('web3');

// Import Inbox smart contract
const { interface, bytecode } = require('../compile');

const INITIAL_STRING = 'Hi there!';

// contract test code will go here

const web3 = new Web3(ganache.provider());

var accounts;
var inbox;

beforeEach(async () => {
	// Get a list of all accounts
	accounts = await web3.eth.getAccounts();

	// Use one of those accounts to deploy the contract
	inbox = await new web3.eth.Contract(JSON.parse(interface))
		.deploy({ data: bytecode, arguments: [INITIAL_STRING] })
		.send({ from: accounts[0], gas: '1000000' });
});

describe('Inbox contract', () => {
	// Verify smart contract deployment
	it('deploys a contract', () => {
		console.log(inbox);
		// check if inbox contract has address atached to it (that means that deployment was succesfull)
		assert.ok(inbox.options.address);
	});

	// Test	initial message of smart contract
	it('has a defeault message', async () => {
		const message = await inbox.methods.message().call();

		assert.equal(message, INITIAL_STRING);
	});

	// Test for set message function of smart contract
	it('can change message', async () => {
		await inbox.methods.setMessage('Bye').send({ from: accounts[0] });

		const message = await inbox.methods.message().call();
		assert.equal(message, "bye")
	});
});

// class Car {
// 	park() {
// 		return 'stopped';
// 	}

// 	drive() {
// 		return 'vroom';
// 	}
// }

// // mocha testing functions

// // define car so it can be accesable outside beforeEach function and it tests
// var car;

// // This function runs before it() tests
// beforeEach(() => {
// 	car = new Car();
// });

// // describe groups it testing function
// describe('Car Class', () => {
// 	// it test for function park of car class
// 	it('can park', () => {
// 		// car instance is created with beforeEach function
// 		assert.equal(car.park(), 'stopped');
// 	});

// 	// it test for function drive of car class
// 	it('can drive', () => {
// 		// car instance is created with beforeEach function
// 		assert.equal(car.drive(), 'vroom');
// 	});
// });
