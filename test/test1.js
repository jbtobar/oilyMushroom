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

tokenAmount = 50000

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
    it('addes stakes', async function() {
        // _tokenAddresses = [token1.address,token1.address,token1.address,token1.address,token2.address,token2.address,token2.address,token2.address,token3.address,token3.address,token3.address,token3.address]
        // _campaigns =      [0,0,1,1,0,0,1,2,0,1,2,3]
        // _stakes = [10,20,11,1,15,2,1,2,5,10,20,30]
        // _bountyHunterAddresses = [bountyHunter1,bountyHunter2,bountyHunter3,bountyHunter1,bountyHunter2,bountyHunter3,bountyHunter1,bountyHunter2,bountyHunter3,bountyHunter1,bountyHunter2,bountyHunter3]

        _tokenAddresses = ['0xb3fe04fe73d672001f2f31549592911c9e4539e6']
        _campaigns =      [0]
        _stakes = [5]
        _bountyHunterAddresses = ['0xb3fe04fe73d672001f2f31549592911c9e4539e6']
        console.log(_tokenAddresses.length)
        console.log(_campaigns.length)
        console.log(_stakes.length)
        console.log(_bountyHunterAddresses.length)
        await bountyDropper.addStakes(_tokenAddresses, _campaigns,_stakes,  _bountyHunterAddresses)
    })
    it('added 1 and 2', async function() {
        ad1 = await bountyDropper.added1()
        ad2 = await bountyDropper.added2()
        console.log(ad1.valueOf())
        console.log(ad2.valueOf())
    })
    // it('Add 100 stakes in ICO-1 for BH-2', async function() {
    //     await bountyDropper.addStake(token1.address,100,bountyHunter2)
    // })
    // it('Add 1000 stakes in ICO-1 for BH-3', async function() {
    //     await bountyDropper.addStake(token1.address,1000,bountyHunter3)
    // })
    // it('Add 500 stakes in ICO-2 for BH-1', async function() {
    //     await bountyDropper.addStake(token2.address,500,bountyHunter1)
    // })
    // it('Add 50 stakes in ICO-2 for BH-2', async function() {
    //     await bountyDropper.addStake(token2.address,50,bountyHunter2)
    // })
    // it('Add 300 stakes in ICO-2 for BH-3', async function() {
    //     await bountyDropper.addStake(token2.address,300,bountyHunter3)
    // })
    // it('Add 500 stakes in ICO-3 for BH-1', async function() {
    //     await bountyDropper.addStake(token3.address,500,bountyHunter1)
    // })
    // it('Add 500 stakes in ICO-3 for BH-2', async function() {
    //     await bountyDropper.addStake(token3.address,1000,bountyHunter2)
    // })
    // it('Add 500 stakes in ICO-3 for BH-3', async function() {
    //     await bountyDropper.addStake(token3.address,400,bountyHunter3)
    // })
    it('Prelimiary Balances', async function() {
        var a1 = await token1.balanceOf(bountyHunter1)
        var a2 = await token1.balanceOf(bountyHunter2)
        var a3 = await token1.balanceOf(bountyHunter3)

        var b1 = await token2.balanceOf(bountyHunter1)
        var b2 = await token2.balanceOf(bountyHunter2)
        var b3 = await token2.balanceOf(bountyHunter3)

        var c1 = await token3.balanceOf(bountyHunter1)
        var c2 = await token3.balanceOf(bountyHunter2)
        var c3 = await token3.balanceOf(bountyHunter3)

        message = `
            Token 1 Balances
            BountyHunter1 : `+a1.valueOf()+`
            BountyHunter2 : `+a2.valueOf()+`
            BountyHunter3 : `+a3.valueOf()+`
            -------------------------
            Token 2 Balances
            BountyHunter1 : `+b1.valueOf()+`
            BountyHunter2 : `+b2.valueOf()+`
            BountyHunter3 : `+b3.valueOf()+`
            -------------------------
            Token 3 Balances
            BountyHunter1 : `+c1.valueOf()+`
            BountyHunter2 : `+c2.valueOf()+`
            BountyHunter3 : `+c3.valueOf()+`
        `
        console.log(message)
    })

    it('HUNTING GAMES', async function() {
        var what = await bountyDropper.huntinGames.call('0xb3fe04fe73d672001f2f31549592911c9e4539e6',0)
        console.log(what.valueOf())
    })
    it('Distributes stakes in ICO-1 at rate of 50', async function() {
        await bountyDropper.distributeStakes(token1.address,0,1)
    })
    it('Balances', async function() {
        var a1 = await token1.balanceOf(bountyHunter1)
        var a2 = await token1.balanceOf(bountyHunter2)
        var a3 = await token1.balanceOf(bountyHunter3)

        var b1 = await token2.balanceOf(bountyHunter1)
        var b2 = await token2.balanceOf(bountyHunter2)
        var b3 = await token2.balanceOf(bountyHunter3)

        var c1 = await token3.balanceOf(bountyHunter1)
        var c2 = await token3.balanceOf(bountyHunter2)
        var c3 = await token3.balanceOf(bountyHunter3)

        message = `
            Token 1 Balances
            BountyHunter1 : `+a1.valueOf()+`
            BountyHunter2 : `+a2.valueOf()+`
            BountyHunter3 : `+a3.valueOf()+`
            -------------------------
            Token 2 Balances
            BountyHunter1 : `+b1.valueOf()+`
            BountyHunter2 : `+b2.valueOf()+`
            BountyHunter3 : `+b3.valueOf()+`
            -------------------------
            Token 3 Balances
            BountyHunter1 : `+c1.valueOf()+`
            BountyHunter2 : `+c2.valueOf()+`
            BountyHunter3 : `+c3.valueOf()+`
        `
        console.log(message)
    })
    it('Distributes stakes in ICO-1 at rate of 50', async function() {
        await bountyDropper.distributeStakes(token1.address,1,3)
    })
    it('Balances', async function() {
        var a1 = await token1.balanceOf(bountyHunter1)
        var a2 = await token1.balanceOf(bountyHunter2)
        var a3 = await token1.balanceOf(bountyHunter3)

        var b1 = await token2.balanceOf(bountyHunter1)
        var b2 = await token2.balanceOf(bountyHunter2)
        var b3 = await token2.balanceOf(bountyHunter3)

        var c1 = await token3.balanceOf(bountyHunter1)
        var c2 = await token3.balanceOf(bountyHunter2)
        var c3 = await token3.balanceOf(bountyHunter3)

        message = `
            Token 1 Balances
            BountyHunter1 : `+a1.valueOf()+`
            BountyHunter2 : `+a2.valueOf()+`
            BountyHunter3 : `+a3.valueOf()+`
            -------------------------
            Token 2 Balances
            BountyHunter1 : `+b1.valueOf()+`
            BountyHunter2 : `+b2.valueOf()+`
            BountyHunter3 : `+b3.valueOf()+`
            -------------------------
            Token 3 Balances
            BountyHunter1 : `+c1.valueOf()+`
            BountyHunter2 : `+c2.valueOf()+`
            BountyHunter3 : `+c3.valueOf()+`
        `
        console.log(message)
    })


})
