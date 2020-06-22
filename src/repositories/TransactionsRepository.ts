import Transaction from '../models/Transaction';
import { json } from 'express';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

class TransactionsRepository {
  private transactions: Transaction[];
  private balance = {} as Balance;

  constructor() {
    this.transactions = [];
    this.updateBalance();
  }

  public all() {
    this.updateBalance();
    let obj = { "transactions":  this.transactions,"balance": this.balance };
    return obj;
  }

  private updateBalance(){
    this.balance.income = this.getValueForType("income");
    this.balance.outcome = this.getValueForType("outcome");
    this.balance.total = this.balance.income - this.balance.outcome;
  }
  private getValueForType(type :string){

    let result = this.transactions.filter(x => x.type === type).reduce(function(prev, cur) {
      return prev + cur.value;
    }, 0);

    return result;
  }

  public create(data :Transaction): Transaction {
    this.updateBalance();
    if(data.type === "outcome" && data.value > this.balance.total) {
      throw Error('should not be able to create outcome transaction without a valid balance');
    }
    const transaction = new Transaction(data);
    this.transactions.push(transaction);


    return transaction;
  }
}

export default TransactionsRepository;
