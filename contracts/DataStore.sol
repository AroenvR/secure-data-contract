// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * This contract is to store & view cipher texts.
 * The owner of this contract is a checksum of msg.sender + salt for extra anonymity in case the private variable gets read.
 */
contract DataStore {
    bytes32 private immutable creatorHash;
    string[] private cipherTexts;

    constructor(uint salt) {
        creatorHash = keccak256(abi.encodePacked(msg.sender, salt));
    }

    /**
     * public getter for this contract's address.
     * @param salt required to call this function.
     * @return address of this contract.
     * modifier: Only the creator of this contract may call this.
     */
    function getContractAddress(uint salt) public onlyCreator(salt) view returns (address) {
        return address(this);
    }

    /**
     * Stores a cipherText on this contract.
     * @param salt required to execute this function.
     * @param cipherText to store on the contract.
     * modifier: Only the creator of this contract may call this.
     */
    function addCipherText(uint salt, string memory cipherText) external onlyCreator(salt) {
        cipherTexts.push(cipherText);
    }

    /**
     * Returns all current cipherTexts on this contract.
     * @return cipherTexts all current cipherTexts on this contract.
     * modifier: Only the creator of this contract may call this.
     */
    function getCipherTexts(uint salt) external view onlyCreator(salt) returns (string[] memory) {
        return cipherTexts;
    }

    //---------------Modifiers------------------

    /**
    * modifier to check if the sender is the creator of this board.
    */
    modifier onlyCreator(uint salt) {
        require(creatorHash == keccak256(abi.encodePacked(msg.sender, salt)), "Only the creator may call this.");
        _;
    }

}