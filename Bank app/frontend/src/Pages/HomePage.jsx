import React, { useState, useEffect, useRef } from 'react';
import contractABI from '../abi.json';
import Web3 from 'web3';
import { useWeb3Modal } from '@web3modal/react';
import { useAccount } from 'wagmi';

// images
import ethImg from '../assets/images/eth.png';
import exchange from '../assets/images/exchange.png';

// icons
import { AiOutlineRight, AiOutlineUser } from 'react-icons/ai';
import { PiCurrencyEurBold } from 'react-icons/pi';

function HomePage() {
	const { open, close } = useWeb3Modal();
	const { address, isConnected } = useAccount();
	const [accountBalance, setAccountBalance] = useState('€0');
	const [accountBalanceEther, setAccountBalanceEther] = useState(0);
	const [displayAddress, setDisplayAddress] = useState(
		'Please connect to a wallet.'
	);
	const [recipientAddress, setRecipientAddress] = useState();
	const [amountToTransfer, setAmountToTransfer] = useState(0);
	const [loading, setLoading] = useState(false);
	const contractAddress = '0x5Ef67cCBFEFd795bEf79D082dfB4A65FaACe52D5';

	let web3 = new Web3(window.ethereum);

	let contract = new web3.eth.Contract(contractABI, contractAddress);

	const connectWallet = async () => {
		setLoading(true);
		open();
		setLoading(false);
	};

	const getAccountBalance = async (address) => {
		const balance = await contract.methods.viewBalance(address).call();
		const balanceToEther = parseFloat(
			web3.utils.fromWei(balance, 'ether')
		).toFixed(4);
		setAccountBalance(
			'€' + (balanceToEther * 1525.2).toFixed(5).toString().replace('.', ',')
		);
		setAccountBalanceEther(balanceToEther);
	};

	const transferAmmount = async (e) => {
		e.preventDefault();
		setLoading(true);
		await contract.methods.pay(recipientAddress).send({
			from: address,
			value: web3.utils.toWei(amountToTransfer, 'ether'),
		});
		setLoading(false);

		// Get new account balance
		getAccountBalance(address);
	};

	useEffect(() => {
		if (isConnected) {
			setDisplayAddress(`${address.slice(0, 6)}...${address.slice(-4)}`);

			// Get account balance
			getAccountBalance(address);
		} else {
			setDisplayAddress('Please connect to a wallet.');
		}
	}, [isConnected]);

	window.ethereum.on('accountsChanged', function (accounts) {
		console.log('account changed');
		window.location.reload(false);
	});
	return (
		<div className="container">
			{isConnected ? (
				<div className="address-container" onClick={() => connectWallet()}>
					<img
						src={`https://avatars.dicebear.com/api/human/${address}.svg`}
						alt=""
					/>
					<p>{displayAddress}</p>
					<AiOutlineRight color="gray" />
				</div>
			) : (
				<button onClick={() => connectWallet()}>
					{loading ? <div className="spinner"></div> : 'Connect Wallet'}
				</button>
			)}

			{isConnected && (
				<>
					<div className="account-balance">
						<div className="total-balance">
							<p>
								Total balance in <span>EUR</span>
							</p>
							<h1>{accountBalance}</h1>
						</div>

						<div className="exchange">
							<img src={exchange} alt="" />
						</div>
						<h2>Coins:</h2>
						<div className="ethereum">
							<div>
								<p>Ethereum</p>
								<div className="ethereum-container">
									<p>{accountBalanceEther} ETH</p>
									<span>{accountBalance}</span>
								</div>
							</div>

							<div className="ethereum-logo">
								<img src={ethImg} alt="" />
							</div>
						</div>
					</div>
					<div className="transfer-container">
						<h1>Transfer etherium:</h1>

						<form onSubmit={(e) => transferAmmount(e)}>
							<p>Recipient address:</p>

							<div className="input-container">
								<AiOutlineUser color="gray" />
								<input
									type="text"
									name="address"
									placeholder="Address of user who will recieve eth"
									value={recipientAddress}
									onChange={(e) => setRecipientAddress(e.target.value)}
								/>
							</div>

							<p>Eth amount:</p>

							<div className="input-container">
								<PiCurrencyEurBold color="gray" />
								<input
									type="text"
									name="amount"
									placeholder="Amount of eth to send"
									value={amountToTransfer}
									onChange={(e) => setAmountToTransfer(e.target.value)}
								/>
							</div>

							<br></br>

							<button>
								{loading ? <div className="spinner"></div> : 'Send'}
							</button>
						</form>
					</div>
				</>
			)}
		</div>
	);
}

export default HomePage;
