const Transaction = require('./transaction');
const Wallet = require('./index');

describe('Transaction', () => {
    let transaction, wallet, receipient, amount;

    beforeEach(() => {
        wallet = new Wallet();
        amount = 50;
        receipient = 'r3c1p13nt';
        transaction = Transaction.newTransaction(wallet, receipient, amount);
    });

    it('outputs the `amount` subtracted from the wallet balance', () => {
        expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount)
        .toEqual(wallet.balance - amount);
    });

    it('outputs the `amount` added from the wallet balance', () => {
        expect(transaction.outputs.find(output => output.address === receipient).amount)
        .toEqual(amount);
    });

    it('inputs the balance of the wallet', () => {
        expect(transaction.input.amount).toEqual(wallet.balance);
    });

    it('validates a valid transaction', () => {
        expect(Transaction.verifyTransaction(transaction)).toBe(true);
    });

    it('invalidates a corrupt transaction', () => {
        transaction.outputs[0].amount = 50000;
        expect(Transaction.verifyTransaction(transaction)).toBe(false);
    });

    describe('transacting with an amount that exceeds the balance', () => {
        beforeEach(() => {
            amount = 50000;
            transaction = Transaction.newTransaction(wallet, receipient, amount);
        });

        it('does not create the transaction', () => {
            expect(transaction).toEqual(undefined);
        });
    });

    describe('and updating a transaction', () => {
        let nextAmount, nextReceipient;

        beforeEach(() => {
            nextAmount = 20;
            nextReceipient = 'n3xt-4ddr355';
            transaction = transaction.update(wallet, nextReceipient, nextAmount);
        });

        it(`subtracts the next amount from the sender's output`, () => {
            expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount)
            .toEqual(wallet.balance - amount - nextAmount);
        });

        it('outputs the amount for the next receipient', () => {
            expect(transaction.outputs.find(output => output.address === nextReceipient).amount)
            .toEqual(nextAmount);
        });
    });
});