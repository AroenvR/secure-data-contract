// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;

import "./FenBoard.sol";

// TODO: Add Biconomy Relayers?

// Help with error handling: https://www.youtube.com/watch?v=1Mi1ub9bIv8
contract FenService {

    address private immutable creator;

    address private immutable falsyAddress = 0x0000000000000000000000000000000000000000;

    FenBoard[] private fenBoards;
    mapping (address => uint256) private userBalances;

    // public constructor
    constructor() {
        creator = msg.sender;
    }

    /**
    * Creates a new FenBoard.
    * param addressWhite Address of the white player.
    * param addressBlack Address of the black player.
    * revert If the FenBoard already exists (based on the address combination).
    */
    function createBoard(address addressWhite, address addressBlack) external { // Transaction
        FenBoard board = findBoardByAddresses(addressWhite, addressBlack);
        
        // require the board's address to be equal to a blank address, otherwise a board already exists for that address combination.
        require(address(board) == address(falsyAddress), "Board already exists.");

        FenBoard newBoard = new FenBoard(addressWhite, addressBlack);
        fenBoards.push(newBoard);
    }

    /**
    * Gets the FenBoard for the given board state.
    * param addressWhite Address of the white player.
    * param addressBlack Address of the black player.
    * returns The current boardState of the FenBoard.
    * revert If the FenBoard does not exist.
    */
    function getBoardState(address addressWhite, address addressBlack) external view returns (string memory) {
        FenBoard board = findBoardByAddresses(addressWhite, addressBlack);

        require(address(board) != address(falsyAddress), "Board does not yet exists.");

        return board.getBoardState();
    }

    /**
    * Sets a new boardState for a FenBoard.
    * param boardState The new boardState to set to.
    * param addressWhite Address of the white player.
    * param addressBlack Address of the black player.
    * revert If the FenBoard does not exist.
    */
    function updateBoard(string calldata boardState, address addressWhite, address addressBlack) external {
        FenBoard board = findBoardByAddresses(addressWhite, addressBlack);

        require(address(board) != address(falsyAddress), "Board does not yet exists.");
        require(msg.sender == board.getWhiteAddress() || msg.sender == board.getBlackAddress(), "You are not a player of this board.");

        board.setBoardState(boardState);
    }

    /**
    * returns the address of the creator of a FenBoard.
    */
    function getBoardCreator(address addressWhite, address addressBlack) external view returns (address) {
        FenBoard board = findBoardByAddresses(addressWhite, addressBlack);

        require(address(board) != falsyAddress, "No board found.");
        
        return board.getCreatorAddress();
    }

    /**
    * Gets the FenBoard for the given address combination.
    * param addressWhite Address of the white player.
    * param addressBlack Address of the black player.
    * returns The FenBoard for the given address combination or an empty contract address if no FenBoard exists for the given address combination.
    */
    function findBoardByAddresses(address addressWhite, address addressBlack) public view returns (FenBoard fenBoard) {
        for (uint i = 0; i < fenBoards.length; i++) {
            if (fenBoards[i].getWhiteAddress() == addressWhite && fenBoards[i].getBlackAddress() == addressBlack) {
                return fenBoards[i]; // 0xC5D1812068933E598cD9cD3E4dD35B95873003Ef
            }
        }

        // returns an empty contract if no boards were found: 0x0000000000000000000000000000000000000000
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
    * returns a special message to the creator of this contract.
    * modifier: Only the creator of this contract may call this.
    */
    function getSpecialMessage() external onlyCreator view returns (string memory) {
        return "Luke, I am your father!";
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

    /**
    * modifier to check if the message sender is the creator of this board.
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
    
}