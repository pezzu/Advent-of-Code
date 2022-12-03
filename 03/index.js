const fs = require("fs");

const input = fs.readFileSync(__dirname + "/input.txt", "utf8").split("\r\n");
const rucksacks = input.map((line) => [
  line.split("").slice(0, line.length / 2),
  line.split("").slice(line.length / 2),
]);

const commonItems = rucksacks.map(([rucksack1, rucksack2]) =>
  rucksack1.filter((item) => rucksack2.includes(item))[0]
);

const getPriority = (item) => {
  if (item.charCodeAt(0) >= 65 && item.charCodeAt(0) <= 90) {
    return item.charCodeAt(0) - "A".charCodeAt(0) + 27;
  } else if (item.charCodeAt(0) >= 97 && item.charCodeAt(0) <= 122) {
    return item.charCodeAt(0) - "a".charCodeAt(0) + 1;
  }
};

const sumOfPriorities = commonItems.map(getPriority).reduce((acc, curr) => acc + curr, 0);

console.log(sumOfPriorities);
