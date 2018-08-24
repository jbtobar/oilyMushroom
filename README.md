# oilyMushroom

# BountyDropper

The contract is located here: `/contracts/BountyDropper.sol`

**Contract and tests updated Aug, 24, 2018**

Look at the contract and the tests below.

(testfile in test directory)

```javascript
pragma solidity ^0.4.24;
import "./ERC20Token.sol";

contract BountyDropper {

    address public owner;

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

    function addStakes(address[] _tokenAddresses, uint[] _campaigns, uint[] _stakes, address[] _bountyHunterAddresses) public onlyOwner {
        require(_tokenAddresses.length == _stakes.length);
        require(_stakes.length == _bountyHunterAddresses.length);
        require(_bountyHunterAddresses.length == _campaigns.length);

        for ( uint i=0; i<_stakes.length; i++) {
            if (stakes[_tokenAddresses[i]][_campaigns[i]].stakeMap[_bountyHunterAddresses[i]] > 0) {
                stakes[_tokenAddresses[i]][_campaigns[i]].stakeMap[_bountyHunterAddresses[i]] += _stakes[i];
            } else {
                stakes[_tokenAddresses[i]][_campaigns[i]].hunterList.push(_bountyHunterAddresses[i]);
                stakes[_tokenAddresses[i]][_campaigns[i]].stakeMap[_bountyHunterAddresses[i]] = _stakes[i];
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


```
## Test results

You can look at the testfile in the `test` directory. It is also useful to know how to interact with this contract using web3.

In this test we have 3 ICOs and 3 BountyHunters (BH). We add stakes for all of them and then distribute them one by one. The output shows the balances after distribution.

Here are the results:
```
Contract: BountyDropper
  ✓ Deploys BountyDropper (69ms)
  ✓ Deploys ICO-1, ICO-2, ICO-3 Tokens (259ms)
  ✓ Minting ICO-1, ICO-2, ICO-3, Tokens to BountyDropper (330ms)
12
12
12
12
  ✓ addes stakes (249ms)

          Token 1 Balances
          BountyHunter1 : 0
          BountyHunter2 : 0
          BountyHunter3 : 0
          -------------------------
          Token 2 Balances
          BountyHunter1 : 0
          BountyHunter2 : 0
          BountyHunter3 : 0
          -------------------------
          Token 3 Balances
          BountyHunter1 : 0
          BountyHunter2 : 0
          BountyHunter3 : 0

  ✓ Prelimiary Balances (156ms)
  ✓ Distributes stakes in ICO-1 at rate of 50 (94ms)

          Token 1 Balances
          BountyHunter1 : 10
          BountyHunter2 : 20
          BountyHunter3 : 0
          -------------------------
          Token 2 Balances
          BountyHunter1 : 0
          BountyHunter2 : 0
          BountyHunter3 : 0
          -------------------------
          Token 3 Balances
          BountyHunter1 : 0
          BountyHunter2 : 0
          BountyHunter3 : 0

  ✓ Balances (140ms)
  ✓ Distributes stakes in ICO-1 at rate of 50 (79ms)

          Token 1 Balances
          BountyHunter1 : 13
          BountyHunter2 : 20
          BountyHunter3 : 33
          -------------------------
          Token 2 Balances
          BountyHunter1 : 0
          BountyHunter2 : 0
          BountyHunter3 : 0
          -------------------------
          Token 3 Balances
          BountyHunter1 : 0
          BountyHunter2 : 0
          BountyHunter3 : 0

  ✓ Balances (152ms)
  ✓ Distributes stakes in ICO-1 at rate of 50 (78ms)

          Token 1 Balances
          BountyHunter1 : 13
          BountyHunter2 : 20
          BountyHunter3 : 33
          -------------------------
          Token 2 Balances
          BountyHunter1 : 0
          BountyHunter2 : 15
          BountyHunter3 : 2
          -------------------------
          Token 3 Balances
          BountyHunter1 : 0
          BountyHunter2 : 0
          BountyHunter3 : 0

  ✓ Balances (150ms)
  ✓ Distributes stakes in ICO-1 at rate of 50 (61ms)

          Token 1 Balances
          BountyHunter1 : 13
          BountyHunter2 : 20
          BountyHunter3 : 33
          -------------------------
          Token 2 Balances
          BountyHunter1 : 2
          BountyHunter2 : 15
          BountyHunter3 : 2
          -------------------------
          Token 3 Balances
          BountyHunter1 : 0
          BountyHunter2 : 0
          BountyHunter3 : 0

  ✓ Balances (143ms)
  ✓ Distributes stakes in ICO-1 at rate of 50 (55ms)

          Token 1 Balances
          BountyHunter1 : 13
          BountyHunter2 : 20
          BountyHunter3 : 33
          -------------------------
          Token 2 Balances
          BountyHunter1 : 2
          BountyHunter2 : 35
          BountyHunter3 : 2
          -------------------------
          Token 3 Balances
          BountyHunter1 : 0
          BountyHunter2 : 0
          BountyHunter3 : 0

  ✓ Balances (143ms)
  ✓ Distributes stakes in ICO-1 at rate of 50 (66ms)

          Token 1 Balances
          BountyHunter1 : 13
          BountyHunter2 : 20
          BountyHunter3 : 33
          -------------------------
          Token 2 Balances
          BountyHunter1 : 2
          BountyHunter2 : 35
          BountyHunter3 : 2
          -------------------------
          Token 3 Balances
          BountyHunter1 : 0
          BountyHunter2 : 0
          BountyHunter3 : 15

  ✓ Balances (145ms)
  ✓ Distributes stakes in ICO-1 at rate of 50 (109ms)

          Token 1 Balances
          BountyHunter1 : 13
          BountyHunter2 : 20
          BountyHunter3 : 33
          -------------------------
          Token 2 Balances
          BountyHunter1 : 2
          BountyHunter2 : 35
          BountyHunter3 : 2
          -------------------------
          Token 3 Balances
          BountyHunter1 : 30
          BountyHunter2 : 0
          BountyHunter3 : 15

  ✓ Balances (156ms)
  ✓ Distributes stakes in ICO-1 at rate of 50 (68ms)

          Token 1 Balances
          BountyHunter1 : 13
          BountyHunter2 : 20
          BountyHunter3 : 33
          -------------------------
          Token 2 Balances
          BountyHunter1 : 2
          BountyHunter2 : 35
          BountyHunter3 : 2
          -------------------------
          Token 3 Balances
          BountyHunter1 : 30
          BountyHunter2 : 400
          BountyHunter3 : 15

  ✓ Balances (143ms)
  ✓ Distributes stakes in ICO-1 at rate of 50 (58ms)

          Token 1 Balances
          BountyHunter1 : 13
          BountyHunter2 : 20
          BountyHunter3 : 33
          -------------------------
          Token 2 Balances
          BountyHunter1 : 2
          BountyHunter2 : 35
          BountyHunter3 : 2
          -------------------------
          Token 3 Balances
          BountyHunter1 : 30
          BountyHunter2 : 400
          BountyHunter3 : 345

  ✓ Balances (145ms)


23 passing (3s)
```



---

## How it works:

1. Only the 'Owner' can call the functions of this contract
2. To add a stake, use function `addStake(address _tokenAddress, uint _stake, address _bountyHunterAddress)`. This will store how many stakes any bountyHunter has in any ICO.
3.  To distribute stakes, use function `distributeStakes(address _tokenAddress, uint _stakeToTokens)`. This will distribute the stakes for a given tokenAddress. The second argument is important, as it dictates the rate of conversion between stakes and tokens. So this function will go through all of the bountyHunters for the given ICO, multiply the number of stakes they have by the argument given in this function, and transfer the result to each bountyHunter.

## IMPORTANT!

I have not yet implemented a control to make sure that the rate of stakes to tokens is such that it allows to transfer the correct amount to all bountyHunters. Thus, as of now, **it depends on correct and responsible use by the contract owner**. What I mean is: if contract owner passes a stakeToTokens variable that is too big, then only a certain number of bountyHunters will receive their tokens and it might then ... oh now that I think about this, I can implement this control very easily tonight.


Also, the contract has to have control of all of the tokens in order to distribute them.

I also have to take a look at the maximum amount of data a contract can hold to see how many bountyHunters and ICO's could be stored here.



---


# OLD NOTES BELOW

**The below notes were preliminary and not important now**

Below are two drafts for the most simple implementation I can think of.

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
