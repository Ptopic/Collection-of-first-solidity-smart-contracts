// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

contract Bank {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    // Pay to account
    function pay(address payable to) public payable {
        payable(to).transfer(msg.value);
    }

    // View my account balance
    function viewBalance(address accountAddress) public view returns (uint) {
        return address(accountAddress).balance;
    }
}
