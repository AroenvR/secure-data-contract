// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Foo {

    address private immutable creator;

    // public constructor
    constructor() {
        creator = msg.sender;
    }

    /**
    * public getter for this contract's address.
    * modifier: Only the creator of this contract may call this.
    */
    // function getContractAddress() public onlyCreator view returns (address) {
    //     return address(this);
    // }

    /**
    * returns the creator's address.
    * modifier: Only the creator of this contract may call this.
    */
    function getCreatorAddress() public onlyCreator view returns(address) {
        return creator;
    }

    //---------------Modifiers------------------

    /**
    * modifier to check if the sender is the creator of this board.
    */
    modifier onlyCreator() {
        require(creator == msg.sender, "Only the creator may call this.");
        _;
    }

}