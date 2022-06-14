// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FenBoard {

    address private immutable creator;

    address private immutable addressWhite;
    address private immutable addressBlack;
    string private boardState;

    // public constructor
    constructor(address white, address black) {
        creator = msg.sender;
        addressWhite = white;
        addressBlack = black;

        boardState = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
    }

    // public contract address getter
    // function getContractAddress() public onlyCreator view returns (address) {
    //     return address(this);
    // }

    /**
    * public getter for the white player's address.
    * modifier: Only the creator of this contract may call this.
    */
    function getWhiteAddress() public onlyCreator view returns (address) { //_onlyOwner
        return addressWhite;
    }

    /**
    * public getter for the black player's address.
    * modifier: Only the creator of this contract may call this.
    */
    function getBlackAddress() public onlyCreator view returns (address) {
        return addressBlack;
    }

    /**
    * public getter for the board's current state.
    * modifier: Only the creator of this contract may call this.
    */
    function getBoardState() public onlyCreator view returns (string memory) {
        return boardState;
    }

    /**
    * public getter for the board's current state.
    * modifier: Only the creator of this contract may call this.
    */
    function setBoardState(string memory _boardState) public onlyCreator {
        boardState = _boardState;
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

}