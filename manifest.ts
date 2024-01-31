import { Manifest } from "deno-slack-sdk/mod.ts";

import ListenThanksWorkflow from "./workflows/listen_thx_workflow.ts";
import StatisticsThanksWorkflow from "./workflows/stats_thx_workflow.ts";
import RefillThanksWorkflow from "./workflows/schedule_refill_workflow.ts";
import ThxDataStore from "./datastores/thx_datastore.ts";

/**
 * The app manifest contains the app's configuration. This
 * file defines attributes like app name and description.
 * https://api.slack.com/automation/manifest
 */
export default Manifest({
  name: "gratitude",
  description: "An app for giving gratitude in a simple way",
  icon: "assets/thanks_icon.png",
  workflows: [ListenThanksWorkflow, StatisticsThanksWorkflow, RefillThanksWorkflow],
  outgoingDomains: [],
  datastores: [ThxDataStore],
  botScopes: [
    "commands",
    "chat:write",
    "chat:write.public",
    "datastore:read",
    "datastore:write",
    // Needed for ReactionAdded event
    "emoji:read",
    "reactions:read",
    // Needed for postMessage event
    "channels:history",
    "groups:history",
    "im:read",
    "mpim:read",
    // Needed to get users.info
    "users:read",
    "users:read.email"
  ],
});
