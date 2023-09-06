import React, { useState, useEffect } from 'react';
import web3 from './components/web3';
import lottery from './components/lotteryContract';

function App() {
	const [manager, setManager] = useState();
	const [players, setPlayers] = useState([]);
	const [balance, setBalance] = useState([]);
	const [value, setValue] = useState(0);
	const [message, setMessage] = useState('');

	useEffect(() => {
		getAccounts();
		getData();
	}, []);

	const getData = async () => {
		const managerAddress = await lottery.methods.manager().call();
		const playersArray = await lottery.methods.getPlayers().call();
		const balanceValue = await web3.eth.getBalance(lottery.options.address);
		setManager(managerAddress);
		setPlayers(playersArray);
		setBalance(balanceValue);
	};

	const getAccounts = async () => {
		const accounts = await web3.eth.getAccounts();
		console.log(accounts);
	};

	const onEnter = async (e) => {
		e.preventDefault();

		const accounts = await web3.eth.getAccounts();

		setMessage('Waiting on transaction success...');
		await lottery.methods.enter().send({
			from: accounts[0],
			value: web3.utils.toWei(value, 'ether'),
		});

		setMessage('You have been entered!');
	};

	const pickWinner = async (e) => {
		e.preventDefault();

		const accounts = await web3.eth.getAccounts();

		setMessage('Waiting on transaction success...');

		await lottery.methods.pickWinner().send({
			from: accounts[0],
		});
	};
	return (
		<div className="App">
			<h1>Lottery Contract</h1>
			<p>
				This contract is manager by {manager}. There are currently
				{players.length} people entered, competing to win
				{web3.utils.fromWei(balance, 'ether')} ether
			</p>

			<form onSubmit={(e) => onEnter(e)}>
				<h4>Want to try your luck?</h4>
				<br></br>
				<div>
					<label>Amount of ether to enter:</label>
					<br></br>
					<input
						type="text"
						value={value}
						onChange={(e) => setValue(e.target.value)}
					/>
				</div>
				<button type="submit">Enter</button>
			</form>

			<button onClick={(e) => pickWinner(e)}>Pick winner</button>

			<p>{message}</p>
		</div>
	);
}

export default App;
