import SHA256 from "crypto-js/sha256";
import { Transaction } from "./transaction.class";

interface IBlock {
  transactions: Transaction[];
  timestamp?: Date;
}

export class Block {
  private _previousHash: string;
  private _hash: string;
  private _nonce: number;
  private _timestamp: Date;
  private _transactions: Transaction[];

  constructor({ transactions, timestamp }: IBlock) {
    this._timestamp = timestamp || new Date();
    this._transactions = transactions;
    this._nonce = 0;
    this._hash = this.calculateHash();
    this._previousHash = "0";
  }

  get hash(): string {
    return this._hash;
  }

  get previousHash(): string {
    return this._previousHash;
  }

  set previousHash(newPreviousHash: string) {
    this._previousHash = newPreviousHash;
  }

  get transactions(): Transaction[] {
    return this._transactions;
  }

  calculateHash(): string {
    return SHA256(
      this._timestamp +
        this.previousHash +
        this._nonce +
        JSON.stringify(this._transactions)
    ).toString();
  }

  mineBlock(difficulty: number): void {
    while (
      this._hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")
    ) {
      this._nonce++;
      this.regenerateHash();
    }

    console.log("Block mined: " + this._hash);
  }

  hasInvalidTransactions(): boolean {
    for (const transaction of this._transactions) {
      if (!transaction.isValid()) {
        return true;
      }
    }
    return false;
  }

  private regenerateHash(): void {
    this._hash = this.calculateHash();
  }
}
