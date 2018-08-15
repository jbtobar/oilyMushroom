# oilyMushroom

# BountyDropper

Below are two drafts for the most simple implemetation I can think of.

The essence is the following two step process:
1. *BountyDropper* Receives predetermined number of tokens from the ICO after ICO completion.
2. *BountyDropper* distributes those tokens to all bounty hunters according to their stakes.

To accomplish this we store all bountyhunters and their stake for each ICO.

This solution relies on trusting the *BountyDropper* operator. (In this case that would be ICOAdmin)

### How it works
1. *BountyDropper* operator adds a stake using following function:
```javascript
// @param _tokenAddress : address of ICO token for this stake
// @param _bountyHunterAddress : address of bountyhunter who will receive stake
// @param _stake : stake to be received
function addStake(address _tokenAddress, uint _stake, address _bountyHunterAddress) {
    // Depending on implementation, this information
    // is stored in a different way.
    // In 'Basic' implementation, each task finished is stored.
    // In 'Sum' implementation only the sum of stakes for a given bountyHunter is stored
}
```
2. Once ICO has finished, *BountyDropper* operator calls the function to distribute tokens.
```javascript
function distributeStakes(address _tokenAddress) {
    // First we get the info for conversion from stakes to tokens
    // (could be called from other contract)
    // We perform a for loop over all of the stakes
    // for the given ICO, we calculate conversion and transfer stakes to bountyHunters
}
```
3. Done.

This way, the *BountyDropper* operator adds the stakes that each bountyhunter will receive for any ICO. Then when distributeStakes() function is called, it will distribute all tokens for a specific ICO accordingly.


## Contract Drafts

Below are two of the simplest implementations.
#### BountyDropperBasic
In this version, whenever a task is accomplished, the *BountyDropper* operator adds that task and it is stored in the following way:
```javascript
stakes = {
    ico1 = [
        {bountyHunter1, stake1},
        {bountyHunter2, stake2},
        {bountyHunter3, stake3},
        {bountyHunter1, stake4},
        {bountyHunter2, stake5},
        etc...
    ],
    ico2 = [
        {bountyHunter1, stake1},
        {bountyHunter2, stake2},
        {bountyHunter2, stake3},
        etc...
    ],
    ico3 = [...]
    ...
}
```
That is, every task performed is its own element in (which contains the bountyHunter who performed that task and the stake given for it), and in the moment of distribution, function loops over all this list and makes a transfer for each element.

The Pros of this method is the level of granularity, you have information about who did each task and what the stake is.

The Cons of this method is that storage is costly and you end up doing many transfers to the same bountyHunter for each of the separate tasks.

#### BountyDropperBasicSum
This version, instead of storing each task, simply sums of the stakes for each bountyHunter.
```javascript
stakes = {
    ico1 = {
        {bountyHunter1, stake1+stake4},
        {bountyHunter2, stake2+stake5},
        {bountyHunter3, stake3},
        etc...
    },
    ico2 = {
        {bountyHunter1, stake1},
        {bountyHunter2, stake2+stake3}
        etc...
    },
    ico3 = {...}
    ...
}
```
The Pros of this method is that it is cheaper and much more efficient.


struct Stake {
    address[] hunterList;
    mapping(address => uint) stakeMap;
    uint stakeToTokens;
}
mappint(address => Stake) public stakes;


Cons is that you don't have task details, only sum.

## Contracts
### BountyDropperBasic
```javascript=
pragma solidity ^0.4.20;
import "./ERC20Token.sol";

contract BountyDropperBasic {

    address public owner;

    struct Stake {
        uint stake;
        address bountyHunterAddress;
    }

    mapping(address => Stake[]) stakes;

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    constructor() public {
        owner = msg.sender;
    }

    function addStake(address _tokenAddress, uint _stake, address _bountyHunterAddress) public onlyOwner {
        stake[_tokenAddress].push(Stake(_stake,_bountyHunterAddress))
    }

    function distributeStakes(address _tokenAddress) public onlyOwner {

        Token token = Token(_tokenAddress)
        // ----> TODO: Calculation to convert stakes into tokens goes here <----
        // ---->       maybe this conversion is a number that can be called
        // ---->       from another contract.
        stake_to_tokens = SomeConversion()

        for ( uint i = 0; i < stake[_tokenAddress].length; i++ ) {
            bountyHunter = stake[_tokenAddress][i].bountyHunterAddress;
            tokenAmount = stake[_tokenAddress][i].stake * stake_to_tokens;
            token.transfer(bountyHunter, tokenAmount)
        }
    }

}
```
### BountyDropperBasicSum
```javascript=
pragma solidity ^0.4.20;
import "./ERC20Token.sol";


contract BountyDropperBasicSum {

    address public owner;

    mapping(address => address[]) hunterList;
    mapping(address => mapping(address => uint)) stakes;

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    constructor() public {
        owner = msg.sender;
    }

    function addStake(address _tokenAddress, uint _stake, address _bountyHunterAddress) public onlyOwner {
        if (stake[_tokenAddress][_bountyHunterAddress] == 0) {
            hunterList[_tokenAddress].push(_bountyHunterAddress)
        }
        stake[_tokenAddress][_bountyHunterAddress] += 1;
    }

    function distributeStakes(address _tokenAddress) public onlyOwner {

        Token token = Token(_tokenAddress)
        // ----> TODO: Calculation to convert stakes into tokens goes here <----
        // ---->       maybe this conversion is a number that can be called
        // ---->       from another contract.
        stake_to_tokens = SomeConversion()

        for ( uint i = 0; i < hunterList[_tokenAddress].length; i++ ) {
            bountyHunter = hunterList[_tokenAddress][i];
            tokenAmount = stake[_tokenAddress][bountyHunter] * stake_to_tokens;
            token.transfer(bountyHunter, tokenAmount)
        }
    }

}
```

## Moving Forward

#### What this contract accomplishes

- [x] Distributes Tokens from many ICOs to many BountyHunters based on stakes

#### What could be done

- [ ] Better Understanding of how stakes are calculated to finish the `distributeStakes()` function.
- [ ] This contract depends entirely on *BountyDropper* operator, maybe a more decentralized solution is wanted.
- [ ] It could be extended so that ICO bounty manages tasks via this contract
