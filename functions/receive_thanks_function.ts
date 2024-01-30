import { DefineFunction, Schema } from "deno-slack-sdk/mod.ts";
// import SampleObjectDatastore from "../datastores/thx_datastore.ts";
// import ThxDataStore from "../datastores/thx_datastore.ts";
import { ThanksCoinsUser } from "../classes/thxcoins.ts";
import { SlackFunction } from "deno-slack-sdk/mod.ts";
import { checkDBUser } from "./misc_functions.ts";

export const ReceiveThanksFunction = DefineFunction({
  callback_id: "sample_function",
  title: "Sample function",
  description: "A sample function",
  source_file: "functions/receive_thanks_function.ts",
  input_parameters: {
    properties: {
      plus_count: {
        type: Schema.types.number,
      },
      giving_thanks_id: {
        type: Schema.types.string,
      },
      receiving_thanks_id: {
        type: Schema.types.string,
      }
    },
    required: ["plus_count","receiving_thanks_id","giving_thanks_id"],
  },
  output_parameters: {
    properties: {
      updatedMsg: {
        type: Schema.types.string,
        description: "Updated message to be posted",
      },
    },
    required: ["updatedMsg"],
  },
});

/**
 * SlackFunction takes in two arguments: the CustomFunction
 * definition (see above), as well as a function that contains
 * handler logic that's run when the function is executed.
 * https://api.slack.com/automation/functions/custom
 */
export default SlackFunction(
  ReceiveThanksFunction,
  async ({ inputs, client }) => {
    console.log("Inputs received in receive thanks function: \n" + JSON.stringify(inputs));
    if (inputs.receiving_thanks_id == inputs.giving_thanks_id){
      return { outputs: { updatedMsg: "Cannot give thnxcoins to self! :rat: "}};
    }
    
    // https://api.slack.com/methods/users.info
    const giving_thanks_name = await client.users.info({user: inputs.giving_thanks_id});
    if (!giving_thanks_name.ok) {
      return { outputs: { updatedMsg: `User info could not be read from API ${giving_thanks_name.error}`}};
    }

    const receiving_thanks_name = await client.users.info({ user: inputs.receiving_thanks_id});
    if (!receiving_thanks_name.ok) {
      return { outputs: { updatedMsg: `User info could not be read from API ${receiving_thanks_name.error}`}};
    }

    // ------------------------------------------------------
    // Here we already have the two transformed user names
    // At this point we have the user, so let's use our class to better manage it.
    // Let's check our datastore, if there's nothing in there, create user and allocate budget, else get data from there.

    // GIVING COINS USER
    const giver = new ThanksCoinsUser(20,giving_thanks_name.user.name,0,inputs.giving_thanks_id);
    const giving_user_item = await checkDBUser(client, inputs.giving_thanks_id);
    if (JSON.stringify(giving_user_item) === "{}") {
      // This should return error: https://github.com/slackapi/deno-slack-sdk/issues/268
      console.log(`Giving thanks: user ${giving_thanks_name.user.name} has no fields in the datastore, initializing...`);
    } else if (giving_user_item?.id === inputs.giving_thanks_id) { 
      // User is existing in the database and item was found
      console.log(`user ${giving_thanks_name.user.name} in the database, populating values...\n`);
      giver.setBudget = giving_user_item.budget;
      giver.setName = giving_user_item.human_name;
      giver.setTotalCoins = giving_user_item.total_coins;
      giver.setId = giving_user_item.id; 
      console.log("Existing giver: \n " + JSON.stringify(giver));

      if (giver.getBudget <= 0){
        return { outputs: { updatedMsg: `Cannot give thxcoins, you have none :crycat:`}};
      }
    } else {
      return { outputs: { updatedMsg: `Error happened when getting user:  ${giving_thanks_name.user.name} from DB`}};
    }


    // RECEIVING COINS USER
    const receiver = new ThanksCoinsUser(20,receiving_thanks_name.user.name,0,inputs.receiving_thanks_id);
    const receiving_user_item = await checkDBUser(client, inputs.receiving_thanks_id);
    if (JSON.stringify(receiving_user_item) === "{}"){
      console.log(`Receiving thanks: user ${receiving_thanks_name.user.name} has no fields in the datastore, initializing...`);
    } else if (receiving_user_item?.id === inputs.receiving_thanks_id) {
      console.log(`user ${giving_thanks_name.user.name} in the database, populating values...\n`);
      receiver.setBudget = receiving_user_item.budget;
      receiver.setName = receiving_user_item.human_name;
      receiver.setTotalCoins = receiving_user_item.total_coins;
      receiver.setId = receiving_user_item.id;
      console.log("Existing receiver: \n " + JSON.stringify(receiver));
    } else {
      return { outputs: { updatedMsg: `Error happened when getting user:  ${receiving_thanks_name.user.name} from DB`}};
    }
    
    // do the trasaction:
    const result = await giver.give_coins(client,inputs.plus_count,receiver);
    if (result == true){
      console.log("Giver budget: " + giver.getBudget);
      console.log("Receiver coins: " + receiver.getTotalCoins);
      return { outputs: { updatedMsg: `${giver.getName} gave ${inputs.plus_count} thxcoins to ${receiver.getName}` } };
    } else {
      return { outputs: { updatedMsg: `Could not give coins to ${receiver.getName}, there was an error :crycat:` }};
    }
  }
);