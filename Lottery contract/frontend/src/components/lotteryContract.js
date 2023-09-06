import web3 from './web3';
const contractAddress = '0xd13ef1070D85Ef847Fa19ba71fF57726Fd18783D';

const abi = [
	{
		inputs: [],
		name: 'enter',
		outputs: [],
		stateMutability: 'payable',
		type: 'function',
	},
	{
		inputs: [],
		name: 'pickWinner',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [],
		stateMutability: 'nonpayable',
		type: 'constructor',
	},
	{
		inputs: [],
		name: 'getPlayers',
		outputs: [
			{
				internalType: 'address payable[]',
				name: '',
				type: 'address[]',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'manager',
		outputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		name: 'players',
		outputs: [
			{
				internalType: 'address payable',
				name: '',
				type: 'address',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
];

export default new web3.eth.Contract(abi, contractAddress);
