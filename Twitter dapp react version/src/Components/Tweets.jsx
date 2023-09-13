import React, { useState } from 'react';

// icons
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';

function Tweets({
	contract,
	account,
	getTweets,
	tweets,
	setTweets,
	shortAddress,
}) {
	const likeTweetBtn = async (e, author, tweet) => {
		try {
			await contract.methods
				.likeTweet(tweet.id, author)
				.send({ from: account });
			getTweets();
			console.log(tweet.isLiked);
		} catch (error) {
			console.error('Error liking tweet:', error);
		}
	};

	const unLikeTweetBtn = async (e, author, tweet) => {
		try {
			await contract.methods
				.unlikeTweet(tweet.id, author)
				.send({ from: account });
			getTweets();
			console.log(tweet.isLiked);
		} catch (error) {
			console.error('Error liking tweet:', error);
		}
	};

	return (
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
							<div className="author">{shortAddress(tweet.author)}</div>
							<div className="content">{tweet.content}</div>
							<button
								className="like-button"
								onClick={(e) => {
									tweet.isLiked
										? unLikeTweetBtn(e, tweet.author, tweet)
										: likeTweetBtn(e, tweet.author, tweet);
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
	);
}

export default Tweets;
