// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./DataStore.sol";

/**
 * Interface to handle interaction with a DataStore.
 */
interface IDataStore {
    function getContractAddress(uint salt) external view returns (address);
    function addCipherText(uint salt, string memory cipherText) external;
    function getCipherTexts(uint salt) external view returns (string[] memory);
}

/**
 * A Service layer for the DataStore contracts.
 * Allows users to create DataStore contracts and store them anonymously in a mapping.
 * Handles interaction with DataStores.
 */
contract DataStoreService {
    address private immutable creator;
    DataStore[] private dataStores;
    mapping(bytes32 => address) private dataStoreMapping;

    constructor() {
        creator = msg.sender;
    }

    /**
     * Creates a new DataStore contract.
     * @param salt required to create a DataStore contract.
     */
    function createDataStore(uint salt) external {
        DataStore myStore = new DataStore(salt);
        dataStoreMapping[keccak256(abi.encodePacked(msg.sender, salt))] = myStore.getContractAddress(salt);
    }

    /**
     * Gets your DataStore contract address.
     * @param salt required to find your contract's address.
     */
    function getMyDataStoreAddress(uint salt) internal view returns(address) {
        return dataStoreMapping[keccak256(abi.encodePacked(msg.sender, salt))];
    }

    /**
     * Adds a cipherText to your DataStorage contract.
     * @param salt required to interact with your contract.
     * @param cipherText to store on your contract.
     */
    function addCipherTextToMyContract(uint salt, string memory cipherText) external {
        // Other way to call contract:
        // DataStorage myStorage = DataStorage(getMyDataStorageAddress(salt));
        // myStorage.getContractAddress(salt);

        address myDataStoreAddress = getMyDataStoreAddress(salt);
        IDataStore(myDataStoreAddress).addCipherText(salt, cipherText);
    }

    /**
     * Gets all currently stored cipherTexts from your DataStorage contract.
     * @param salt required to interact with your contract.
     * @return cipherTextArray all cipherTexts currently stored on your contract.
     */
    function getCipherTextsFromMyContract(uint salt) external view returns (string[] memory) {
        address myDataStoreAddress = getMyDataStoreAddress(salt);
        return IDataStore(myDataStoreAddress).getCipherTexts(salt);
    }

    //---------------Modifiers------------------

    /**
    * modifier to check if the sender is the creator of this contract.
    */
    modifier onlyCreator() {
        require(creator == msg.sender, "Only the creator may call this.");
        _;
    }

}