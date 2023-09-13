import React, { useState, useEffect } from 'react';

function AddTweet({ contract, account, getTweets }) {
	const [text, setText] = useState('');
	const [loading, setLoading] = useState(false);

	async function createTweet(tweet) {
		if (!contract || !account) {
			console.error(
				'Web3 or contract not initialized or account not connected.'
			);
			return;
		}
		try {
			setLoading(true);
			await contract.methods.createTweet(tweet).send({ from: account });
			getTweets();
		} catch (error) {
			console.error('User rejected request:', error);
		} finally {
			setLoading(false);
		}
	}
	return (
		<>
			<form
				id="tweetForm"
				onSubmit={(e) => {
					e.preventDefault();
					createTweet(text);
				}}
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
		</>
	);
}

export default AddTweet;
