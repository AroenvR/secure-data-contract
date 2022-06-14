// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;

import "./Foo.sol";

// TODO: Add Biconomy Relayers?

// Help with error handling: https://www.youtube.com/watch?v=1Mi1ub9bIv8
contract FooService {
    address private immutable falsyAddress = 0x0000000000000000000000000000000000000000;

    Foo[] private foos;
    mapping (address => uint256) private userBalances;


    /**
    * Creates a new Foo.
    */
    function createFoo() external {
        foos.push(new Foo());
    }

    /**
    * returns the Foo's address.
    */
    // function getFoosAddress() external view returns (address) {
    //     return foos[0].getContractAddress();
    // }

    /**
    * returns the address of the creator of a Foo.
    */
    function getFoosCreator() external view returns (address) {
        return foos[0].getCreatorAddress();
    }

    /**
    * default receive function of a SmartContract.
    */
    receive() external payable {
        if (msg.value <= 0 ether) {
            revert("Donation cannot be less than 0 Ether.");
        }
        userBalances[msg.sender] += msg.value;
    }

    /**
    * returns the balance of the message sender.
    */
    function getMyBalance() external view returns (uint256) {
        return userBalances[msg.sender];
    }

    /**
    * returns the total balance of this contract.
    */
    function getTotalBalance() external view returns (uint256) {
        return address(this).balance;
    }

    /**
    * returns a requested amount back to the user from their balance.
    */
    function withdraw(uint amount) external antiReentrancy payable {
        require(userBalances[msg.sender] >= amount, "You do not have enough balance to withdraw.");

        userBalances[msg.sender] -= amount;

        payable(msg.sender).transfer(amount);
    }

    /**
    * returns a greeting to anyone.
    */
    function getGreeting() external pure returns (string memory) {
        return "Hi! You've successfully connected to the FenService contract!";
    }

    /**
    * returns the current message sender's address;
    */
    function getMsgSender() public view returns(address)  {
        return msg.sender;
    }

    //---------------Modifiers------------------

    bool private locked;
    /**
    * modifier to prevent reentrancy using a mutex lock.
    */
    modifier antiReentrancy() {
        require(!locked, "No re-entrancy");
        locked = true;
        _; // function gets executed here.
        locked = false;
    }
    
}