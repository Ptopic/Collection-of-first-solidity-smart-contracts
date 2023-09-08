import React, { useState, useEffect, useRef } from 'react';
import contractABI from '../abi.json';
import Web3 from 'web3';
import { useWeb3Modal } from '@web3modal/react';
import { useAccount } from 'wagmi';

// icons
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';

function HomePage() {
	const { open, close } = useWeb3Modal();
	const { address, isConnected } = useAccount();
	const [noWallerProvider, setNoWalletProvider] = useState(null);
	const [displayAddress, setDisplayAddress] = useState(null);
	const [loading, setLoading] = useState(false);
	const [text, setText] = useState();
	const [tweets, setTweets] = useState([]);
	const msgRef = useRef(null);
	const formRef = useRef(null);
	const contractAddress = '0x88cAAfe6b5bF4A91Cf7FC61Cb47DE6247EEc897a';

	let web3 = new Web3(window.ethereum);

	let contract = new web3.eth.Contract(contractABI, contractAddress);

	const connectWallet = async () => {
		open();

		setDisplayAddress(`${address.slice(0, 6)}...${address.slice(-4)}`);
		msgRef.current.style.display = 'none';
		formRef.current.style.display = 'block';
		displayTweets(address);
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
				.send({ from: address });
			displayTweets(address);
			console.log(tweet.isLiked);
		} catch (error) {
			console.error('Error liking tweet:', error);
		}
	};

	const unLikeTweetBtn = async (e, author, tweet) => {
		try {
			await contract.methods
				.unlikeTweet(tweet.id, author)
				.send({ from: address });
			displayTweets(address);
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
				<div id="userAddress">{displayAddress}</div>
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
								<div className="author">{displayAddress}</div>
								<div className="content">{tweet.content}</div>
								<button
									className="like-button"
									onClick={(e) => {
										tweet.isLiked
											? unLikeTweetBtn(e, address, tweet)
											: likeTweetBtn(e, address, tweet);
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

export default HomePage;
