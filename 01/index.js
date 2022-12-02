const fs = require("fs");

const callories = fs
  .readFileSync(__dirname + "/input.txt", "utf8")
  .split("\n")
  .map(Number);

const elves = callories.reduce(
  (elves, callory) => {
    if (callory === 0) {
      elves.push(0);
    } else {
      elves[elves.length - 1] += callory;
    }
    return elves;
  },
  [0]
);

const max = elves.reduce((max, current) => Math.max(max, current), 0);
console.log(max);

const topThree = elves
  .sort((a, b) => b - a)
  .slice(0, 3)
  .reduce((sum, group) => sum + group, 0);
console.log(topThree);
