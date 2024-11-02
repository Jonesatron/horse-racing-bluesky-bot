import { AtpAgent } from "@atproto/api";
import * as dotenv from "dotenv";
import { CronJob } from "cron";
import * as process from "process";
import axios from "axios";
import { Race } from "./types.js";
import { getTodaysDate } from "./utils/getTodaysDate.js";
import { getMeetingsWithFirstRaceTime } from "./utils/getMeetingsWithFirstRaceTime.js";

dotenv.config();

// Create a Bluesky Agent
const agent = new AtpAgent({
  service: "https://bsky.social",
});

async function sendSkeet() {
  await agent.login({
    identifier: process.env.BLUESKY_USERNAME!,
    password: process.env.BLUESKY_PASSWORD!,
  });

  // Get Daily Racecards
  const { data } = await axios
    .get<Race[]>("https://horse-racing.p.rapidapi.com/racecards", {
      params: { date: getTodaysDate() },
      headers: {
        "x-rapidapi-key": process.env.RAPID_API_KEY,
        "x-rapidapi-host": "horse-racing.p.rapidapi.com",
      },
    })
    .catch((error) => {
      console.error(error);
      console.log(`Post Failed with Error: ${error}`);
      return { data: [] as Race[] };
    });

  // Get Skeet Text
  const skeetText = getMeetingsWithFirstRaceTime(data);

  // Send Skeet with text
  agent
    .post({
      text: skeetText,
    })
    .then(() => console.log("Skeet Sent"))
    .catch((err) => console.error(err));
}

sendSkeet();

// Run this on a cron job
const scheduleExpression = "0 9 * * *"; // Run at 9am every day

const job = new CronJob(scheduleExpression, sendSkeet);

job.start();
