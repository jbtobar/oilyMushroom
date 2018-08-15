pragma solidity ^0.4.24;
import "./ERC20Token.sol";

contract BountyDropper {

    address public owner;

    struct Stake {
        address[] hunterList;
        mapping(address => uint) stakeMap;
        uint stakeToTokens;
    }
    mapping(address => Stake) public stakes;

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    constructor() public {
        owner = msg.sender;
    }

    function addStake(address _tokenAddress, uint _stake, address _bountyHunterAddress) public onlyOwner {
        require(_stake != 0);
        if (stakes[_tokenAddress].stakeMap[_bountyHunterAddress] == 0) {
            stakes[_tokenAddress].hunterList.push(_bountyHunterAddress);
        }
        stakes[_tokenAddress].stakeMap[_bountyHunterAddress] += 1;
    }

    function distributeStakes(address _tokenAddress, uint _stakeToTokens) public onlyOwner {

        Token token = Token(_tokenAddress);

        stakes[_tokenAddress].stakeToTokens = _stakeToTokens;

        for ( uint i = 0; i < stakes[_tokenAddress].hunterList.length; i++ ) {
            address _bountyHunter = stakes[_tokenAddress].hunterList[i];
            uint _tokenAmount = stakes[_tokenAddress].stakeMap[_bountyHunter] * _stakeToTokens;
            token.transfer(_bountyHunter, _tokenAmount);
        }
    }

}
