import { Blockchain } from "./classes/blockchain.class";
import { Transaction } from "./classes/transaction.class";
import { EC } from "./utils/keygenerator.util";

const myKey = EC.keyFromPrivate(
  "c43c2e5cd16b018d29ec41ec8297ecb440481bb6dd4698cd98f2dd74b8d06e3b"
);

const myWalletAddress = myKey.getPublic("hex");

const myBlockchain = new Blockchain();

myBlockchain.minePendingTransactions(myWalletAddress);

const transaction1 = new Transaction({
  fromAddress: myWalletAddress,
  toAddress: "adddress2",
  amount: 100,
});
transaction1.signTransaction(myKey);
myBlockchain.addTransactionToChain(transaction1);

myBlockchain.minePendingTransactions(myWalletAddress);

const transaction2 = new Transaction({
  fromAddress: myWalletAddress,
  toAddress: "address1",
  amount: 50,
});
transaction2.signTransaction(myKey);
myBlockchain.addTransactionToChain(transaction2);

myBlockchain.minePendingTransactions(myWalletAddress);

console.log(
  `\nBalance of andrea is ${myBlockchain.getBalanceOfAddress(myWalletAddress)}`
);

console.log(
  "\nIs Blockchain valid?",
  myBlockchain.isChainValid() ? "Yes" : "No"
);
