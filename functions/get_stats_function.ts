import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
/**

**/
export const GetStatsFunction = DefineFunction({
  callback_id: "GetStatsFunction",
  title: "Get statistics for thanks",
  description: "Get statistics for thanks functions",
  source_file: "functions/get_stats_function.ts",
  input_parameters: {
    properties: {
      channel: {
        type: Schema.types.string,
      },
      user_id: {
        type: Schema.types.string, // needs to be string (non-nullable) 
      }
    },
    required: ["user_id"],
  },
  output_parameters: {
    properties: {
      output_message: {
        type: Schema.types.string, 
        description: "User that receives thankscoins"
      }
    },
    required: [],
  },
});

/**
 * SlackFunction takes in two arguments: the CustomFunction
 * definition (see above), as well as a function that contains
 * handler logic that's run when the function is executed.
 * https://api.slack.com/automation/functions/custom
 */

export default SlackFunction(
  /*
  In this function we are going to extract and validate the users.
  # Enin Kaduk: [14.00]                ###### This is giving thnxcoins
  #  @Romans++! Deserves thankscoins    ##### This is reciving thnxcoins
  */
  GetStatsFunction,
  async ({ client, inputs }) => {
    let table = "";
    let user_thxcoins = 0;
    const queryResponse = await client.apps.datastore.query({
      datastore: "thxcoins",
      expression: "#total_coins > :total_coins",
      expression_attributes: { "#total_coins": "total_coins"},
      expression_values: {":total_coins": 0}
    });

    // Example response:
    // {"ok":true,"datastore":"thxcoins","items":
    // [{"id":"U1234567","total_coins":3,"budget":20,"human_name":"john.foo"}, {id: "2"...}]}
    if (queryResponse.ok) {
      // We want to have a total_coins + human_name table here.  
      // for (let i = 0; i < queryResponse.items.length; i++){
      //  map_obj.set(queryResponse.items[i].human_name,queryResponse.items[i].total_coins);
      // }
      const sorted = queryResponse.items.map(item => ({
        total_coins: item.total_coins,
        human_name: item.human_name
      }))
      .sort((a, b) => b.total_coins - a.total_coins)
      .slice(0,10);
      table = sorted.map(({total_coins,human_name}) => `${human_name} = ${total_coins}`).join('\n');
      console.log(table);
    } else {
      console.log("queryResponse NOT OK!")
      return { outputs: { output_message: `Error retrieving data ${queryResponse.error}`}};
    }

    // Now get issuing user's thankscoins (if any!)
    const getResponse = await client.apps.datastore.get({
      datastore: "thxcoins",
      id: inputs.user_id
    });
    if (getResponse.ok){
      user_thxcoins = getResponse.item.total_coins;
    } else {
      return { outputs: { output_message: `Error retrieving data ${getResponse.error}`}};
    }
    return { 
      outputs: {
        output_message: `:trophy: *Top 10 users:* \n ${table} \n ...and you have ${user_thxcoins} thxcoins`
      }  
    };
  }
);
