import SHA256 from "crypto-js/sha256";
import elliptic from "elliptic";
import { EC } from "../utils/keygenerator.util";

interface ITransaction {
  fromAddress: string | null;
  toAddress: string;
  amount: number;
}

export class Transaction {
  private _fromAddress: string | null;
  private _toAddress: string;
  private _amount: number;
  private _signature: string | null;

  constructor({ fromAddress, toAddress, amount }: ITransaction) {
    this._fromAddress = fromAddress;
    this._toAddress = toAddress;
    this._amount = amount;
    this._signature = null;
  }

  get fromAddress(): string | null {
    return this._fromAddress;
  }

  get toAddress(): string {
    return this._toAddress;
  }

  get amount(): number {
    return this._amount;
  }

  calculateHash(): string {
    return SHA256(
      this._fromAddress + this._toAddress + this._amount
    ).toString();
  }

  signTransaction(signingKey: elliptic.ec.KeyPair): void {
    if (signingKey.getPublic("hex") !== this._fromAddress) {
      throw new Error("You cannot sign transactions for other wallets!");
    }

    const hashedTransaction = this.calculateHash();
    const signature = signingKey.sign(hashedTransaction, "base64");

    this._signature = signature.toDER("hex");
  }

  isValid(): boolean {
    if (this._fromAddress === null) return true;

    if (
      !this._signature ||
      this._signature.length === 0 ||
      this._signature === "0"
    ) {
      throw new Error("No signature in this transaction");
    }

    const publicKey = EC.keyFromPublic(this._fromAddress, "hex");

    return publicKey.verify(this.calculateHash(), this._signature);
  }
}
