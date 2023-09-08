import React, { useState, useEffect, useRef } from 'react';
import contractABI from './abi.json';
import Web3 from 'web3';
import {
	EthereumClient,
	w3mConnectors,
	w3mProvider,
} from '@web3modal/ethereum';
import { Web3Modal, useWeb3Modal } from '@web3modal/react';
import { configureChains, createConfig, WagmiConfig, useAccount } from 'wagmi';
import { sepolia, mainnet, polygon } from 'wagmi/chains';

// icons
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import HomePage from './Pages/HomePage';

function App() {
	const chains = [sepolia, mainnet, polygon];
	const projectId = '20f5acd47ffb19c8ccf0f0ddd17b0739';

	const { publicClient } = configureChains(chains, [
		w3mProvider({ projectId }),
	]);
	const wagmiConfig = createConfig({
		autoConnect: true,
		connectors: w3mConnectors({ projectId, chains }),
		publicClient,
	});
	const ethereumClient = new EthereumClient(wagmiConfig, chains);

	// Meta mask old connect
	// const connectWallet = async () => {
	// 	if (window.ethereum) {
	// 		const accounts = await window.ethereum
	// 			.request({ method: 'eth_requestAccounts' })
	// 			.catch((err) => {
	// 				if (err.code === 4001) {
	// 					console.log('Please connect to MetaMask.');
	// 				} else {
	// 					console.error(err);
	// 				}
	// 			});

	// 		setConnected(accounts[0]);
	// 		setAddress(`${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`);
	// 		msgRef.current.style.display = 'none';
	// 		formRef.current.style.display = 'block';
	// 		displayTweets(accounts[0]);
	// 	} else {
	// 		console.error('No web3 provider detected');
	// 		setNoWalletProvider(
	// 			'No web3 provider detected. Please install MetaMask.'
	// 		);
	// 	}
	// };

	return (
		<>
			<WagmiConfig config={wagmiConfig}>
				<HomePage />
			</WagmiConfig>
			<Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
		</>
	);
}

export default App;
