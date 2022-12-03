const fs = require("fs");

const input = fs.readFileSync(__dirname + "/input.txt", "utf8").split("\r\n");
const rucksacks = input.map((line) => line.split(""));

const compartments = rucksacks.map((items) => [
  items.slice(0, items.length / 2),
  items.slice(items.length / 2),
]);

const getCommonItem = (rucksacks) =>
  rucksacks.reduce((commonItem, rucksack) =>
    commonItem.filter((item) => rucksack.includes(item))
  )[0];

const commonCompartmentItem = compartments.map(getCommonItem);

const groups = rucksacks.reduce((acc, item, index) => {
  if (index % 3 === 0) {
    acc.push([]);
  }
  acc[acc.length - 1].push(item);
  return acc;
}, []);

const commonGroupItem = groups.map(getCommonItem);

const getPriority = (item) => {
  if (item.charCodeAt(0) >= 65 && item.charCodeAt(0) <= 90) {
    return item.charCodeAt(0) - "A".charCodeAt(0) + 27;
  } else if (item.charCodeAt(0) >= 97 && item.charCodeAt(0) <= 122) {
    return item.charCodeAt(0) - "a".charCodeAt(0) + 1;
  }
};

const sumOfCompartmentPriorities = commonCompartmentItem
  .map(getPriority)
  .reduce((acc, curr) => acc + curr, 0);
const sumOfGroupPriorities = commonGroupItem.map(getPriority).reduce((acc, curr) => acc + curr, 0);

console.log(sumOfCompartmentPriorities);
console.log(sumOfGroupPriorities);
