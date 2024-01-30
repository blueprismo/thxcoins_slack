import { SlackAPIClient } from "https://deno.land/x/deno_slack_sdk@2.5.0/deps.ts";
import ThxDataStore from "../datastores/thx_datastore.ts";
import { ThanksCoinsUser } from "../classes/thxcoins.ts";
import { DatastoreItem } from "deno-slack-api/typed-method-types/apps.ts";

function check_plusplus(message: string): number {
  let counter = 0
  let consecutivePlusCount = 0

  for (let i = 0; i < message.length; i++) {
    if (message[i] === '+'){
      consecutivePlusCount++;

      // Increment count when we encounter a sequence of '+'
      if (consecutivePlusCount >= 2) {
        counter++;
        // Limit the count to a maximum of 20
        if (counter >= 20) {
          break;
        }
      }
    } else {
      consecutivePlusCount = 0;
    }
  }
  return counter
}

function extract_user(message: string): string {
  
  // const regex_payload = new RegExp("^<@[A-Z0-9]*>");
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/match
  const regex_payload = new RegExp("<@([A-Z0-9]*)>");
  let user_id = "";
  const match = message.match(regex_payload);
  
  if (match && match.length === 2 ){
    user_id = match[1];
    console.log("Object matched: " + JSON.stringify(match));
  } else {
    console.log("User not matched or regex not hit");
  }

  return user_id;
}

// Database interaction functions:
// get a user from the database
const checkDBUser = async (client: SlackAPIClient, user_id: string) => {
  const response = await client.apps.datastore.get<typeof ThxDataStore.definition>({
    datastore: "thxcoins",
    id: user_id,
  });
  
  if (!response.ok){
    console.log("Error getting user from DB: " + JSON.stringify(response.error));
  } else {
    return response.item;
  }
}

// Put a user in the database:
const upsertDBUser = async (client: SlackAPIClient, user: ThanksCoinsUser) => {
  const response = await client.apps.datastore.update({
    datastore: "thxcoins",
    item: {
      id: user.getId,
      human_name: user.getName,
      budget: user.getBudget,
      total_coins: user.getTotalCoins
    }
  });

  if (!response.ok){
    console.log("Error upserting user in the database" + JSON.stringify(response.error));
    return false;
  } else {
    return true;
  }
}

// await client.apps.datastore.put({
//   datastore: "thxcoins",
//   item: {
//     id: inputs.receiving_thanks_id,
//     human_name: receiving_thanks_name,
//     total_coins: 0,
//     budget: 20,
//   }
// });

export { check_plusplus, extract_user , checkDBUser, upsertDBUser }
