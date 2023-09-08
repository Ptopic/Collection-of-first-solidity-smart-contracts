import React, { useState, useEffect, useRef } from 'react';
import contractABI from './abi.json';
import Web3 from 'web3';

// icons
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';

function App() {
	const [noWallerProvider, setNoWalletProvider] = useState(null);
	const [connected, setConnected] = useState();
	const [address, setAddress] = useState(null);
	const [loading, setLoading] = useState(false);
	const [text, setText] = useState();
	const [tweets, setTweets] = useState([]);
	const msgRef = useRef(null);
	const formRef = useRef(null);
	const contractAddress = '0x88cAAfe6b5bF4A91Cf7FC61Cb47DE6247EEc897a';

	let web3 = new Web3(window.ethereum);

	let contract = new web3.eth.Contract(contractABI, contractAddress);

	const connectWallet = async () => {
		if (window.ethereum) {
			const accounts = await window.ethereum
				.request({ method: 'eth_requestAccounts' })
				.catch((err) => {
					if (err.code === 4001) {
						console.log('Please connect to MetaMask.');
					} else {
						console.error(err);
					}
				});

			setConnected(accounts[0]);
			setAddress(`${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`);
			msgRef.current.style.display = 'none';
			formRef.current.style.display = 'block';
			displayTweets(accounts[0]);
		} else {
			console.error('No web3 provider detected');
			setNoWalletProvider(
				'No web3 provider detected. Please install MetaMask.'
			);
		}
	};

	const createTweet = async () => {
		const accounts = await web3.eth.getAccounts();
		try {
			setLoading(true);
			await contract.methods.createTweet(text).send({
				from: accounts[0],
			});
			setLoading(false);

			displayTweets(accounts[0]);
		} catch (error) {
			console.error('User rejected request:', error);
			setLoading(false);
		}
	};

	const displayTweets = async (userAddress) => {
		let tempTweets = await contract.methods.getAllTweets(userAddress).call();
		setTweets(tempTweets);
	};

	const formSubmit = async (e) => {
		e.preventDefault();
		try {
			await createTweet(text);
		} catch (error) {
			console.error('Error sending tweet:', error);
		}
	};

	const likeTweetBtn = async (e, author, tweet) => {
		try {
			await contract.methods
				.likeTweet(tweet.id, author)
				.send({ from: connected });
			displayTweets(connected);
			console.log(tweet.isLiked);
		} catch (error) {
			console.error('Error liking tweet:', error);
		}
	};

	const unLikeTweetBtn = async (e, author, tweet) => {
		try {
			await contract.methods
				.unlikeTweet(tweet.id, author)
				.send({ from: connected });
			displayTweets(connected);
			console.log(tweet.isLiked);
		} catch (error) {
			console.error('Error liking tweet:', error);
		}
	};

	// Run when page loads
	useEffect(() => {}, []);

	return (
		<div className="container">
			<h1>Twitter DAPP</h1>
			{noWallerProvider && <div id="connectMessage">{noWallerProvider}</div>}
			<div className="connect">
				<button id="connectWalletBtn" onClick={() => connectWallet()}>
					Connect Wallet
				</button>
				<div id="userAddress">{address}</div>
				<div id="connectMessage" ref={msgRef}>
					Please connect your wallet to tweet.
				</div>
			</div>

			<form
				id="tweetForm"
				style={{ display: 'none' }}
				ref={formRef}
				onSubmit={(e) => formSubmit(e)}
			>
				<textarea
					id="tweetContent"
					rows="4"
					placeholder="What's happening?"
					value={text}
					onChange={(e) => setText(e.target.value)}
				></textarea>
				<br />
				<button id="tweetSubmitBtn" type="submit">
					{loading ? <div className="spinner"></div> : 'Tweet'}
				</button>
			</form>
			<div id="tweetsContainer">
				{tweets.map((tweet, id) => {
					return (
						<div className="tweet">
							<img
								src={`https://avatars.dicebear.com/api/human/${tweet.author}.svg`}
								alt=""
								className="user-icon"
							/>
							<div className="tweet-inner">
								<div className="author">{address}</div>
								<div className="content">{tweet.content}</div>
								<button
									className="like-button"
									onClick={(e) => {
										tweet.isLiked
											? unLikeTweetBtn(e, connected, tweet)
											: likeTweetBtn(e, connected, tweet);
									}}
								>
									{tweet.isLiked ? (
										<AiFillHeart size={26} color={'#e0245e'} />
									) : (
										<AiOutlineHeart size={26} />
									)}
									<span className="likes-count">{tweet.likes}</span>
								</button>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}

export default App;
