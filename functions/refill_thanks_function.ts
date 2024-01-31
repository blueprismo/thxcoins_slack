import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";

//Function definition
export const RefillThanksFunction = DefineFunction({
  callback_id: "RefillThanksFunction",
  title: "Refill thanks function",
  description: "Refill thanks function weekly",
  source_file: "functions/refill_thanks_function.ts",
  output_parameters: {
    properties: {
      output_message: {
        type: Schema.types.string, 
        description: "Output message with errors or ok message."
      }
    },
    required: [],
  },
});

// handling logic for the function
export default SlackFunction(
  /*
  This function:
  1. Gets array of users with less than 20 thnxcoins
  2. For each user, refill it to 20 thxcois
  3. for the rest, do nothing (they already have 20 thxcoins or user doesn't exist)
  */
  RefillThanksFunction,
  async ({ client }) => {
    
    // Get all users with less than 20 thxcoins
    const lessThanTwentyResponse = await client.apps.datastore.query({
      datastore: "thxcoins",
      expression: "#budget < :budget",
      expression_attributes: { "#budget": "budget"},
      expression_values: {":budget": 20}
    });
    
    if (lessThanTwentyResponse.ok) {
      // We want to have a total_coins + human_name table here.  
      for (let i = 0; i < lessThanTwentyResponse.items.length; i++){
        const updatedBudget = await client.apps.datastore.update({
          datastore: "thxcoins",
          item: {
            id: lessThanTwentyResponse.items[i].id,
            budget: 20
          }
        })
        if (updatedBudget.ok){
          console.log(`User ${lessThanTwentyResponse.item[i].human_name} refilled succesfully!`);
        } else {
          console.log(`Error refilling user ${lessThanTwentyResponse.item[i].human_name}: ${updatedBudget.error}`);
        }
       
      }
    } else {
      console.log("lessThanTwentyResponse NOT OK!")
      return { outputs: { output_message: `Error querying data ${lessThanTwentyResponse.error}`}};
    }
    return { 
      outputs: {
        output_message: `:om_symbol: Thanks coins refilled! You can be grateful again, namaste :om_symbol:`
      }  
    };
  }
);
