// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;

import "./FenBoard.sol";

// TODO: Add Biconomy Relayers?

// Help with error handling: https://www.youtube.com/watch?v=1Mi1ub9bIv8
contract FenService {

    FenBoard[] private _fenBoards;

    // struct ResponseDto {
    //     uint statusCode;
    //     string message;
    //     string data;
    // }

    address falsyAddress = 0x0000000000000000000000000000000000000000;

    function getGreeting() external pure returns (string memory) {
        return "Hi! You've successfully connected to the FenService contract!";
    }

    /**
    * Creates a new FenBoard.
    * param address_white Address of the white player.
    * param address_black Address of the black player.
    * revert If the FenBoard already exists (based on the address combination).
    */
    function createBoard(address address_white, address address_black) external { // Transaction
        FenBoard board = findBoardByAddresses(address_white, address_black);
        
        // require the board's address to be equal to a blank address, otherwise a board already exists for that address combination.
        require(address(board) == address(falsyAddress), "Board already exists.");

        board = new FenBoard(address_white, address_black);
        _fenBoards.push(board);
    }

    /**
    * Gets the FenBoard for the given address combination.
    * param address_white Address of the white player.
    * param address_black Address of the black player.
    * returns The FenBoard for the given address combination or an empty contract address if no FenBoard exists for the given address combination.
    */
    function findBoardByAddresses(address address_white, address address_black) public view returns (FenBoard fenBoard) {
        for (uint i = 0; i < _fenBoards.length; i++) {
            if (_fenBoards[i].getWhiteAddress() == address_white && _fenBoards[i].getBlackAddress() == address_black) {
                return _fenBoards[i]; // 0xC5D1812068933E598cD9cD3E4dD35B95873003Ef
            }
        }

        // returns an empty contract if no boards were found: 0x0000000000000000000000000000000000000000
    }

    /**
    * Gets the FenBoard for the given board state.
    * param address_white Address of the white player.
    * param address_black Address of the black player.
    * returns The current boardState of the FenBoard.
    * revert If the FenBoard does not exist.
    */
    function getBoardState(address address_white, address address_black) external view returns (string memory) {
        FenBoard board = findBoardByAddresses(address_white, address_black);

        require(address(board) != address(falsyAddress), "Board does not yet exists.");

        return board.getBoardState();
    }

    /**
    * Sets a new boardState for a FenBoard.
    * param boardState The new boardState to set to.
    * param address_white Address of the white player.
    * param address_black Address of the black player.
    * revert If the FenBoard does not exist.
    */
    function updateBoard(string calldata boardState, address address_white, address address_black) external {
        FenBoard board = findBoardByAddresses(address_white, address_black);

        require(address(board) != address(falsyAddress), "Board does not yet exists.");

        board.setBoardState(boardState);
    }
    
}