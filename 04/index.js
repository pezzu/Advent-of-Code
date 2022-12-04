const fs = require("fs");

const input = fs.readFileSync(__dirname + "/input.txt", "utf8").split("\r\n");

const ranges = input
  .map((line) => line.split(","))
  .map(([range1, range2]) => [range1.split("-").map(Number), range2.split("-").map(Number)]);

const overlaps = (range1, range2) => range1[0] <= range2[1] && range1[1] >= range2[0];
const encolsed = (range1, range2) => range1[0] >= range2[0] && range1[1] <= range2[1];
const fullyContained = ranges.filter(
  ([range1, range2]) => encolsed(range1, range2) || encolsed(range2, range1)
);
const overlapping = ranges.filter(
  ([range1, range2]) => overlaps(range1, range2) || overlaps(range2, range1)
);

console.log(fullyContained.length);
console.log(overlapping.length);
