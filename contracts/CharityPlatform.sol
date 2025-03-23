// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CharityPlatform {
    struct Charity {
        string name;
        string description;
        address payable charityAddress;
        uint256 balance;
    }

    mapping(uint => Charity) public charities;
    uint public charityCount;

    event CharityCreated(uint id, string name, string description, address charityAddress);
    event DonationReceived(uint charityId, address donor, uint amount);

    function createCharity(string memory _name, string memory _description, address payable _charityAddress) public {
        charityCount++;
        charities[charityCount] = Charity(_name, _description, _charityAddress, 0);
        emit CharityCreated(charityCount, _name, _description, _charityAddress);
    }

    function donateToCharity(uint _charityId) public payable {
        require(_charityId > 0 && _charityId <= charityCount, "Invalid charity ID");
        Charity storage charity = charities[_charityId];
        charity.balance += msg.value;
        charity.charityAddress.transfer(msg.value);
        emit DonationReceived(_charityId, msg.sender, msg.value);
    }

    function getCharityDetails(uint _charityId) public view returns (string memory, string memory, address, uint256) {
        require(_charityId > 0 && _charityId <= charityCount, "Invalid charity ID");
        Charity memory charity = charities[_charityId];
        return (charity.name, charity.description, charity.charityAddress, charity.balance);
    }

    function getCharityCount() public view returns (uint) {
        return charityCount;
    }
}
