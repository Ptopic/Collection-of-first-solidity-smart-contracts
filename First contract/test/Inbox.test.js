const assert = require('assert');
const ganache = require('ganache');
const { Web3 } = require('web3');

// Import Inbox smart contract
const { interface, bytecode } = require('../compile');

// contract test code will go here

const web3 = new Web3(ganache.provider());

var accounts;
var inbox;

beforeEach(async () => {
	// Get a list of all accounts
	accounts = await web3.eth.getAccounts();

	// Use one of those accounts to deploy the contract
	inbox = await new web3.eth.Contract(JSON.parse(interface))
		.deploy({ data: bytecode, arguments: ['Hi there!'] })
		.send({ from: accounts[0], gas: '1000000' });
});

describe('Inbox contract', () => {
	it('deploys a contract', () => {
		console.log(inbox);
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
