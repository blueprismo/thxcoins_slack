import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import { check_plusplus, extract_user } from "./misc_functions.ts";

/**
In this function we are going to receive a raw message that contains at least "++" (this is the trigger filter)
We want to obtain a user ID (U12345678[9,0])
And how many thanks we want to give (up to 20!), this is determined by how many ++ are in the message.
++ = 1
+++ = 2
++++ = 3
+++++ = 4
etc.

The return values will be
  greeted_user_id = the user id of who we are giving thanks to
  plus_count = the number of coins we want to give
**/
export const ExtractUserFunction = DefineFunction({
  callback_id: "ExtractUserfunction",
  title: "Extract Users",
  description: "Sanitize the input for giving thanks",
  source_file: "functions/extract_user_function.ts",
  input_parameters: {
    properties: {
      message: {
        type: Schema.types.string,
        description: "Message to be posted",
      }
    },
    required: ["message"],
  },
  output_parameters: {
    properties: {
      greeted_user_id: {
        type: Schema.types.string, 
        description: "User that receives thankscoins"
      },
      plus_count: {
        type: Schema.types.string,
        description: "Optional message for errors"
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
  ExtractUserFunction,
  ({ inputs }) => {
    // <@U046W8F4Z41> ++
    const greeted_user = extract_user(inputs.message);
    console.log("Greeted user: " + greeted_user)
    
    // Count how many "++" we want to give
    const count = check_plusplus(inputs.message);

    return { 
      outputs: {
        greeted_user_id : `${greeted_user}`,
        plus_count: `${count}`,
      }  
    };
  }
);
