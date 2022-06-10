// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FenBoard {

    // private final address address_white
    address private immutable address_white;

    // private final address address_black
    address private immutable address_black;

    // private String boardState
    string private boardState;

    // TODO: Make required modifiers for the _ variables.
    // Only address_white or address_black should be allowed to edit the boardState.

    // public constructor
    constructor(address _address_white, address _address_black) {
        address_white = _address_white;
        address_black = _address_black;

        boardState = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
    }

    // modifier onlyPlayers() {
    //     require(msg.sender == address_white || msg.sender == address_white, "Only players can make moves.");
    //     _;
    // }

    // public contract address getter
    // function getContractAddress() public view returns (address) {
    //     return address(this);
    // }

    // public getter for white address
    function getWhiteAddress() public view returns (address) {
        return address_white;
    }

    // public getter for black address
    function getBlackAddress() public view returns (address) {
        return address_black;
    }

    // public getter for board state
    function getBoardState() public view returns (string memory) {
        return boardState;
    }

    // public setter for board state
    function setBoardState(string memory _boardState) public {
        boardState = _boardState;
    }

}