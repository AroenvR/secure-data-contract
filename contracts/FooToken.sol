//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract FooToken is ERC20 {
    address public immutable creator;

    constructor(string memory _name, string memory _symbol) ERC20(_name, _symbol) {
        creator = msg.sender;
        _mint(_msgSender(), 1); // This contract will mint 1 token to the creator upon creation.

        // TODO: Create an NFT signifying the start of this token?
    }

    /**
    * Sets the amount of decimals this token will have? I think?
    */
    // function decimals() public pure override returns (uint8) {
    //     return 8;
    // }

    /**
    * @dev mint new tokens into circulation.
    * @param _to The address which will own the newly minted token(s) after the transfer.
    * @param _amount The amount of tokens to mint.
    */
    function mint(address _to, uint256 _amount) public {
        require(_msgSender() == creator, "You are not allowed to mint Foo tokens.");
        _mint(_to, _amount);
    }

    /**
    * @return address of this contract.
    */
    function getContractAddress() public view returns (address) {
        return address(this);
    }

    /**
    * @return address of this contract's creator.
    */
    function getCreatorAddress() public view returns (address) {
        return creator;
    }

    //---------------Modifiers------------------

    /**
    * modifier to check if the sender is the creator of this board.
    */
    modifier onlyCreator() {
        require(msg.sender == creator, "Only the creator may call this.");
        _;
    }
}
