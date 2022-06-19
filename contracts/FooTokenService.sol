//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./FooToken.sol";

contract FooTokenService {
    address private immutable creator;

    FooToken private immutable fooToken;

    constructor() {
        creator = msg.sender;
        fooToken = new FooToken("FooToken", "FTN");
    }

    /**
    * Mints tokens into circulation.
    * @param minter The address which will own the newly minted token(s) after the transfer.
    * @param amount The amount of tokens to mint.
    */
    function mint(address minter, uint256 amount) public {
        fooToken.mint(minter, amount);
    }

    /**
    * @param user the address of the user to check the balance of.
    * @return balance of tokens for the user's address.
    */
    function getBalanceOf(address user) public view returns (uint256) {
        return fooToken.balanceOf(user);
    }

    /**
    * @dev checks the total supply of tokens in circulation.
    * @return amount of tokens in circulation.
    */
    function getTotalTokenSupply() public onlyMyToken view returns (uint256) {
        return fooToken.totalSupply(); // Every one can look at this. Secured with onlyBreakerToken in case this function gets used later down the line for calculations of the vault.
    }

    /**
    * returns the Foo Token's contract address.
    */
    function getTokenAddress() public view returns (address) {
        return fooToken.getContractAddress();
    }

    /**
    * returns the creator of the token's address (should always be equal to address(this)).
    */
    function getTokenCreator() public view returns (address) {
        return fooToken.getCreatorAddress();
    }

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

    /**
    * modifier to check the service is communicating with the right token before executing a function.
    */
    modifier onlyMyToken() {
        address receivedCreator = getTokenCreator();
        require(receivedCreator == address(this), "I only communicate with my own babies.");
        _;
    }

}