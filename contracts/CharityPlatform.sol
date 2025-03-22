// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CharityPlatform {
    address public owner;
    uint public charityCount = 0; //Track the number of charities

    struct Charity {
        string name;
        string description;
        address payable charityAddress;
        uint balance;
    }

    struct Donor {
        uint totalDonated;
    }

    mapping(uint => Charity) public charities; //Store charities using an ID instead of address
    mapping(address => Donor) public donors;  //Declare `donors` mapping
    address[] public donorList;  //Declare `donorList` array

    event CharityCreated(uint charityId, address indexed charityAddress, string name);
    event DonationMade(address indexed donor, address indexed charity, uint amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function createCharity(string memory _name, string memory _description, address payable _charityAddress) public onlyOwner {
        charityCount++; //Increment charity count
        charities[charityCount] = Charity(_name, _description, _charityAddress, 0);
        emit CharityCreated(charityCount, _charityAddress, _name);
    }

    function donateToCharity(uint _charityId) public payable {
        require(msg.value > 0, "Donation amount must be greater than 0");
        require(charities[_charityId].charityAddress != address(0), "Charity does not exist");

        charities[_charityId].balance += msg.value;
        payable(charities[_charityId].charityAddress).transfer(msg.value);

        donors[msg.sender].totalDonated += msg.value;  //Now includes donor address
        donorList.push(msg.sender);  //Stores the donor address

        emit DonationMade(msg.sender, charities[_charityId].charityAddress, msg.value);
    }

    function getCharityCount() public view returns (uint) {
        return charityCount;
    }

    function getCharityDetails(uint _charityId) public view returns (string memory, string memory, address, uint) {
        Charity memory charity = charities[_charityId];
        return (charity.name, charity.description, charity.charityAddress, charity.balance);
    }
}