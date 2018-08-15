BountyDropper = artifacts.require('BountyDropper')
Token = artifacts.require('Token')

accounts = web3.eth.accounts

icoAdmin = accounts[0]
ico1 = accounts[1]
ico2 = accounts[2]
ico3 = accounts[3]

bountyHunter1 = accounts[4]
bountyHunter2 = accounts[5]
bountyHunter3 = accounts[6]

tokenAmount = 500

contract('BountyDropper', function(accounts) {

    it('Deploys BountyDropper', async function() {
        bountyDropper = await BountyDropper.new({from:icoAdmin})
    });

    it('Deploys ICO-1, ICO-2, ICO-3 Tokens', async function() {
        token1 = await Token.new('ICO1', 'ICO1', 18, {from:ico1})
        token2 = await Token.new('ICO1', 'ICO1', 18, {from:ico2})
        token3 = await Token.new('ICO1', 'ICO1', 18, {from:ico3})
    });

    it('Minting ICO-1, ICO-2, ICO-3, Tokens to BountyDropper', async function() {
        await token1.mint(bountyDropper.address, tokenAmount*500, {from: ico1});
        await token2.mint(bountyDropper.address, tokenAmount*500, {from: ico2});
        await token3.mint(bountyDropper.address, tokenAmount*500, {from: ico3});

        await token1.start({from: ico1});
        await token2.start({from: ico2});
        await token3.start({from: ico3});

        balance1 = await token1.balanceOf(bountyDropper.address);
        balance2 = await token2.balanceOf(bountyDropper.address);
        balance3 = await token3.balanceOf(bountyDropper.address);

        assert.equal(balance1.valueOf(), tokenAmount*500, "Tokens have not been minted to the ICOContract");
        assert.equal(balance2.valueOf(), tokenAmount*500, "Tokens have not been minted to the ICOContract");
        assert.equal(balance3.valueOf(), tokenAmount*500, "Tokens have not been minted to the ICOContract");
    });

    it('Add 500 stakes in ICO-1 for BH-1', async function() {
        stake1 = {
            _tokenAddress: token1.address,
            _stake: 500,
            _bountyHunterAddress: bountyHunter1
        }
        await bountyDropper.addStake(token1.address,500,bountyHunter1)
    })


})
