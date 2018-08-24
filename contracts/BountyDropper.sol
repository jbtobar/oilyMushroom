pragma solidity ^0.4.24;
import "./ERC20Token.sol";

contract BountyDropper {

    address public owner;
    uint public added1;
    uint public added2;

    struct Stake {
        address[] hunterList;
        mapping(address => uint) stakeMap;
        uint stakeToTokens;
    }
    mapping(address => mapping(uint => Stake)) public stakes;

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    constructor() public {
        owner = msg.sender;
    }

    function addStakes(address[] _tokenAddresses, uint[] _stakes, address[] _bountyHunterAddresses, uint[] _campaigns) public onlyOwner {
        require(_tokenAddresses.length == _stakes.length);
        require(_stakes.length == _bountyHunterAddresses.length);
        require(_bountyHunterAddresses.length == _campaigns.length);

        for ( uint i=0; i<_stakes.length; i++) {
            if (stakes[_tokenAddresses[i]][_campaigns[i]].stakeMap[_bountyHunterAddresses[i]] > 0) {
                stakes[_tokenAddresses[i]][_campaigns[i]].stakeMap[_bountyHunterAddresses[i]] += _stakes[i];
                added1 += 1;
            } else {
                stakes[_tokenAddresses[i]][_campaigns[i]].hunterList.push(_bountyHunterAddresses[i]);
                stakes[_tokenAddresses[i]][_campaigns[i]].stakeMap[_bountyHunterAddresses[i]] = _stakes[i];
                added2 += 1;
            }

        }
    }

    function addStake(address _tokenAddress, uint _stake, address _bountyHunterAddress, uint _campaign) public onlyOwner {
        require(_stake != 0);
        if (stakes[_tokenAddress][_campaign].stakeMap[_bountyHunterAddress] == 0) {
            stakes[_tokenAddress][_campaign].hunterList.push(_bountyHunterAddress);
        }
        stakes[_tokenAddress][_campaign].stakeMap[_bountyHunterAddress] += _stake;
    }
    function huntinGames(address _tokenAddress, uint _campaign) public onlyOwner returns(uint) {
        return stakes[_tokenAddress][_campaign].hunterList.length;
    }

    function distributeStakes(address _tokenAddress, uint _campaign ,uint _stakeToTokens) public onlyOwner {
        require(stakes[_tokenAddress][_campaign].hunterList.length > 0);
        Token token = Token(_tokenAddress);

        stakes[_tokenAddress][_campaign].stakeToTokens = _stakeToTokens;

        for ( uint i = 0; i < stakes[_tokenAddress][_campaign].hunterList.length; i++ ) {
            address _bountyHunter = stakes[_tokenAddress][_campaign].hunterList[i];
            uint _tokenAmount = stakes[_tokenAddress][_campaign].stakeMap[_bountyHunter] * _stakeToTokens;
            token.transfer(_bountyHunter, _tokenAmount);
        }
    }

}
