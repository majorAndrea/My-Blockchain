import { Block } from "./block.class";
import { Transaction } from "./transaction.class";

interface IBlockchain {
  difficulty?: number;
}

export class Blockchain {
  private _pendingTransactions: Transaction[] = [];
  private _chain: Block[] = [];
  private _difficulty = 2;
  private _miningReward = 100;

  constructor({ difficulty = 2 }: IBlockchain = {}) {
    this._chain = [this.createGenesisBlock()];
    this._difficulty = difficulty;
  }

  getChain(): Block[] {
    return this._chain;
  }

  getLatestBlockInChain(): Block {
    return this._chain[this._chain.length - 1];
  }

  minePendingTransactions(miningRewardAddress: string) {
    const rewardTransaction = new Transaction({
      fromAddress: null,
      toAddress: miningRewardAddress,
      amount: this._miningReward,
    });

    this._pendingTransactions.push(rewardTransaction);

    const block = new Block({ transactions: this._pendingTransactions });

    block.previousHash = this.getLatestBlockInChain().hash;
    block.mineBlock(this._difficulty);

    console.log("Block successfully mined!");

    this._chain.push(block);
    this._pendingTransactions = [];
  }

  addTransactionToChain(transaction: Transaction): void {
    if (!transaction.fromAddress || !transaction.toAddress) {
      throw new Error("Transaction must have a 'from' and 'to' address");
    }

    if (!transaction.isValid) {
      throw new Error("Cannot add an invalid transaction to the chain");
    }

    if (transaction.amount <= 0) {
      throw new Error("Transaction amount should be higher than 0");
    }

    if (
      this.getBalanceOfAddress(transaction.fromAddress) < transaction.amount
    ) {
      throw new Error("Not enough balance");
    }

    this._pendingTransactions.push(transaction);
  }

  getBalanceOfAddress(address: string) {
    let balance = 0;

    for (const block of this._chain) {
      for (const transaction of block.transactions) {
        if (transaction.fromAddress === address) {
          balance -= transaction.amount;
        }

        if (transaction.toAddress === address) {
          balance += transaction.amount;
        }
      }
    }

    return balance;
  }

  getAllTransactionsForWallet(address: string) {
    const transactions = [];

    for (const block of this._chain) {
      for (const transaction of block.transactions) {
        if (
          transaction.fromAddress === address ||
          transaction.toAddress === address
        ) {
          transactions.push(transaction);
        }
      }
    }

    return transactions;
  }

  isChainValid(): boolean {
    const realGenesis = JSON.stringify(this.createGenesisBlock());

    if (realGenesis !== JSON.stringify(this._chain[0])) {
      return false;
    }

    for (let i = 1; i < this._chain.length; i++) {
      const currentBlock = this._chain[i];
      const previousBlock = this._chain[i - 1];

      if (currentBlock.hasInvalidTransactions()) {
        return false;
      }

      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }

      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }

    return true;
  }

  private createGenesisBlock(): Block {
    return new Block({
      timestamp: new Date("2022-01-23"),
      transactions: [
        new Transaction({ toAddress: "0", fromAddress: "0", amount: 0 }),
      ],
    });
  }
}
