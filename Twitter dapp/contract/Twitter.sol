// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract Twitter {
    struct Tweet {
        uint256 id;
        address author;
        string content;
        uint256 timestamp;
        uint256 likes;
    }

    uint16 public MAX_TWEET_LENGTH = 280;

    mapping(address => Tweet[]) public tweets;

    address public owner;

    // Events

    event TweetCreated(uint id, address author, string content, uint timeStamp);

    event TweetLiked(
        address liker,
        address tweetAuthor,
        uint tweetId,
        uint newLikeCount
    );
    event TweetUnliked(
        address unliker,
        address tweetAuthor,
        uint tweetId,
        uint newLikeCount
    );

    // Consturctor to set owner of contract
    constructor() {
        owner = msg.sender;
    }

    function createTweet(string memory _tweet) public {
        // conditional
        // if tweet length <= 280 then we are good, otherwise we revert
        require(bytes(_tweet).length <= MAX_TWEET_LENGTH, "Tweet is too long");

        Tweet memory newTweet = Tweet({
            id: tweets[msg.sender].length,
            author: msg.sender,
            content: _tweet,
            timestamp: block.timestamp,
            likes: 0
        });

        tweets[msg.sender].push(newTweet);

        emit TweetCreated(
            newTweet.id,
            newTweet.author,
            newTweet.content,
            newTweet.timestamp
        );
    }

    function getTweet(uint _i) public view returns (Tweet memory) {
        return tweets[msg.sender][_i];
    }

    function getAllTweets(address _owner) public view returns (Tweet[] memory) {
        return tweets[_owner];
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "You are not the owner");
        _;
    }

    function changeTweetLength(uint16 newTweetLength) public onlyOwner {
        MAX_TWEET_LENGTH = newTweetLength;
    }

    function likeTweet(uint256 id, address author) public {
        require(tweets[author][id].id == id, "Tweet does not exist");
        tweets[author][id].likes++;

        emit TweetLiked(msg.sender, author, id, tweets[author][id].likes);
    }

    function unlikeTweet(uint256 id, address author) public {
        require(tweets[author][id].id == id, "Tweet does not exist");
        require(tweets[author][id].likes > 0, "Tweet does not have any likes");

        tweets[author][id].likes--;

        emit TweetUnliked(msg.sender, author, id, tweets[author][id].likes);
    }
}
