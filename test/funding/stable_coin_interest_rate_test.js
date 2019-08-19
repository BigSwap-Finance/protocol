require('../utils/hooks');
const StableCoinInterestModel = artifacts.require('StableCoinInterestModel.sol');
const { toWei } = require('../utils');
const assert = require('assert');
const BigNumber = require('bignumber.js');

contract('StableCoinInterestModel', accounts => {
    let model;
    const base = 10 ** 18;

    before(async () => {
        model = await StableCoinInterestModel.new();
    });

    it('should pass correct borrow rate', async () => {
        // ok
        await model.polynomialInterestModel(0);

        // ok
        await model.polynomialInterestModel(toWei('1'));

        // wrong
        await assert.rejects(
            model.polynomialInterestModel(toWei('1.01')),
            /BORROW_RATIO_WRONG_VALUE/
        );
    });

    it('should match', async () => {
        assert.equal(await model.polynomialInterestModel(0), toWei('0.05'));

        assert.equal(await model.polynomialInterestModel(toWei('1')), toWei('1'));

        assert.equal(await model.polynomialInterestModel(toWei('0.8')), toWei('0.398274688'));

        assert.equal(
            await model.polynomialInterestModel(toWei('0.05')),
            toWei('0.051000000021484375')
        );

        assert.equal(
            await model.polynomialInterestModel(toWei('0.31')),
            toWei('0.088486909007059255')
        );
    });

    const calc = r => {
        const base = '1000000000000000000';

        const r1 = new BigNumber(r).times(base);
        const r2 = new BigNumber(
            r1
                .times(r1)
                .div(base)
                .toFixed(0, 1)
        );
        const r4 = new BigNumber(
            r2
                .times(r2)
                .div(base)
                .toFixed(0, 1)
        );
        const r8 = new BigNumber(
            r4
                .times(r4)
                .div(base)
                .toFixed(0, 1)
        );

        // return 0.05 * 10 ** 18 + (r2 * 4) / 10 + (r8 * 55) / 100;
        const result = new BigNumber(0.05)
            .times(base)
            .plus(r2.times(4).div(10))
            .plus(r8.times(55).div(100))
            .toFixed(0, 1);

        console.log(`r = ${r}, interest rate = ${result}`);

        return result;
    };

    // test all interest rate
    it.skip('show interest values', async () => {
        for (let i = 0; i <= 1000; i++) {
            const borrowRate = new BigNumber(i).div('1000');

            assert.equal(await model.polynomialInterestModel(toWei(borrowRate)), calc(borrowRate));
        }
    });
});