const fs = require("fs");

const input = fs
  .readFileSync(__dirname + "/input.txt", "utf8")
  .split("\r\n")
  .map((line) => line.split("").map(Number));

const left = (i, j, input) => input[i].slice(0, j).reverse();
const right = (i, j, input) => input[i].slice(j + 1);
const up = (i, j, input) => input.slice(0, i).map((row) => row[j]).reverse();
const down = (i, j, input) => input.slice(i + 1).map((row) => row[j]);

const visible = (height, row) => row.every((num) => height > num);
const score = (height, row) => row.findIndex((num) => height <= num) + 1 || row.length;

let totalVisible = 0;
let maxScore = 0;
input.forEach((row, i) => {
  row.forEach((num, j) => {
    const currentVisible =
      visible(num, left(i, j, input)) ||
      visible(num, right(i, j, input)) ||
      visible(num, up(i, j, input)) ||
      visible(num, down(i, j, input));
    if (currentVisible) {
      totalVisible++;
    }
    const currentScore =
      score(num, left(i, j, input)) *
      score(num, right(i, j, input)) *
      score(num, up(i, j, input)) *
      score(num, down(i, j, input));
    if (currentScore > maxScore) {
      maxScore = currentScore;
    }
  });
});

console.log(totalVisible);
console.log(maxScore);
