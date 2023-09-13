import React from 'react';
import Web3 from 'web3';
import contractABI from '../Contract/main.json';
import profileContractABI from '../Contract/user.json';

const contractAddress = '0x54BCe6Fa882684a742013047ac2555EA6E8638b0';
const profileContractAddress = '0x0c10d6698473167391c84241dF36c5611328365A';

function Connect({
	open,
	web3,
	account,
	shortAddress,
	setContract,
	setAccount,
	setProfileContract,
	setWeb3,
}) {
	const connectWallet = async () => {
		open();

		try {
			let web3 = new Web3(window.ethereum);
			setWeb3(web3);
			const contractInstance = new web3.eth.Contract(
				contractABI,
				contractAddress
			);

			const profileContractInstance = new web3.eth.Contract(
				profileContractABI,
				profileContractAddress
			);
			setProfileContract(profileContractInstance);
			const accounts = await web3.eth.getAccounts();
			if (accounts.length > 0) {
				setContract(contractInstance);
				setAccount(accounts[0]);
			}
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<>
			<div className="connect">
				{!account ? (
					<button id="connectWalletBtn" onClick={connectWallet}>
						Connect Wallet
					</button>
				) : (
					<div id="userAddress">Connected: {shortAddress(account)}</div>
				)}
			</div>
			<div id="connectMessage">
				{!account ? 'Please connect your wallet to tweet.' : ''}
			</div>
		</>
	);
}

export default Connect;
