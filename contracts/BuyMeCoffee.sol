//SPDX-License-Identifier:MIT
pragma solidity ^0.8.9;

contract BuyMeCoffee {
    struct Memo {
        address from;
        uint256 timestamp;
        string name;
        string message;
    }
    event NewMemo(
        address indexed from,
        uint256 timestamp,
        string name,
        string message
    );
    address payable public owner;
    Memo[] memos;

    constructor() {
        owner = payable(msg.sender);
    }

    function getMemos() public view returns (Memo[] memory) {
        return memos;
    }

    modifier onlyOwner() {
        require(owner == msg.sender, "You are not an owner");
        _;
    }

    function buyCoffeeSmall(string memory _name, string memory _message)
        public
        payable
    {
        require(msg.value == 0.001 ether, "can't buy coffee for free!");
        memos.push(Memo(msg.sender, block.timestamp, _name, _message));
        emit NewMemo(msg.sender, block.timestamp, _name, _message);
    }

    function buyCoffeeLarge(string memory _name, string memory _message)
        public
        payable
    {
        require(msg.value == 0.003 ether, "can't buy coffee for free!");
        memos.push(Memo(msg.sender, block.timestamp, _name, _message));
        emit NewMemo(msg.sender, block.timestamp, _name, _message);
    }

    function withdraw() public payable onlyOwner {
        owner.transfer(address(this).balance);
    }

    function updateOwner(address _newOwner) public onlyOwner{
        owner = payable(_newOwner);
    }
}
