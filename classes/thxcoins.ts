import { SlackAPIClient } from "https://deno.land/x/deno_slack_sdk@2.5.0/deps.ts";
import { upsertDBUser } from "../functions/misc_functions.ts";

class ThanksCoinsUser {
  private _budget: number;
  private _humanName: string;
  private _totalCoins: number;
  private _id: string;

  constructor(budget: number, name: string, totalCoins: number, id: string){
    this._budget = budget;
    this._humanName = name;
    this._totalCoins = totalCoins;
    this._id = id;
  }

  // Getters
  get getName(): string {
    return this._humanName;
  }
  get getBudget(): number {
    return this._budget;
  }
  get getTotalCoins(): number {
    return this._totalCoins;
  }
  get getId(): string {
    return this._id;
  }

  // Setters
  set setName(name: string) {
    this._humanName = name;
  }
  set setBudget(amount: number) {
    this._budget = amount;
  }
  set setTotalCoins(amount: number){
    this._totalCoins = amount;
  }
  set setId(id: string) {
    this._id = id;
  }

  // method give_coins
  async give_coins(client: SlackAPIClient, amount: number, recipient: ThanksCoinsUser) {

    if (this._humanName == recipient.getName){
      console.log("Cannot give thankscoins to self!")
    }

    if (amount > 0 && amount <= this._budget){
      this._budget -= amount;
      recipient.receiveCoins(amount);
      console.log(`${this._humanName} gave ${amount} thxcoins to ${recipient.getName}`);
    } else {
      console.log("You don't have enough budget to give thxcoins!");
    }
    // update db values
    if (await upsertDBUser(client, this) === true ){
      if (await upsertDBUser(client, recipient) === true){
        return true
      } else { 
        return false
      }
    } else {
      return false
    }
    
  }

  private receiveCoins(amount: number) {
    if (amount > 0) {
      this._totalCoins += amount;
      console.log(`${this._humanName} received ${amount} thxcoins.`);
    }
  }
}

export { ThanksCoinsUser }
