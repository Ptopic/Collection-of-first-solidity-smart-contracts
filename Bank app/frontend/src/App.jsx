import React, { useState, useEffect, useRef } from 'react';
import {
	EthereumClient,
	w3mConnectors,
	w3mProvider,
} from '@web3modal/ethereum';
import { Web3Modal } from '@web3modal/react';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { sepolia, mainnet, polygon } from 'wagmi/chains';

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
