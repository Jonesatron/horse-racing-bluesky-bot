import { Race } from "../types.js";
import _ from "lodash";
import dayjs from "dayjs";

export const getMeetingsWithFirstRaceTime = (races: Race[]) => {
  return Object.values(_.groupBy(races, "course"))
    .sort((a, b) => dayjs(a[0].date).valueOf() - dayjs(b[0].date).valueOf())
    .map(([firstRace]) => {
      const date = dayjs(firstRace.date);
      return `🐎 ${firstRace.course} - ${date.format("HH:mm")}`;
    })
    .join("\r\n");
};
