const Wallet = require('./index');
const TransactionPool = require('./transaction-pool');
const Blockchain = require('../blockchain');

describe('Wallet', () => {
    let wallet, tp, bc;

    beforeEach(() => {
        wallet = new Wallet();
        tp = new TransactionPool();
        bc = new Blockchain();
    });

    describe('creating a transaction', () => {
        let transaction, sendAmount, receipient;

        beforeEach(() => {
            sendAmount = 50;
            receipient = 'r4nd0m-4ddr355';
            transaction = wallet.createTransaction(receipient, sendAmount, bc, tp);
        });

        describe('and doing the same transaction', () => {
            beforeEach(() => {
                wallet.createTransaction(receipient, sendAmount, bc, tp);
            });
            
            it('doubles the `sendAmount` subtracted from the wallet balance', () => {
                expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount)
                .toEqual(wallet.balance - sendAmount * 2);
            });

            it('clones the `sendAmount` output for the receipient', () => {
                expect(transaction.outputs.filter(output => output.address === receipient)
                .map(output => output.amount)).toEqual([sendAmount, sendAmount]);
            });
        });
    });
});

