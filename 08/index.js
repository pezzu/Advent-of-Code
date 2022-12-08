const fs = require("fs");

const input = fs
  .readFileSync(__dirname + "/input.txt", "utf8")
  .split("\r\n")
  .map((line) => line.split("").map(Number));

const left = (i, j, input) => input[i].slice(0, j).reverse();
const right = (i, j, input) => input[i].slice(j + 1);
const up = (i, j, input) =>
  input
    .slice(0, i)
    .map((row) => row[j])
    .reverse();
const down = (i, j, input) => input.slice(i + 1).map((row) => row[j]);

const map2d = (fn, input) => input.map((row, i) => row.map((num, j) => fn(num, i, j, input)));

const visible = (height, row) => row.every((num) => height > num);
const visibleAllDirections = (height, i, j, input) =>
  visible(height, left(i, j, input)) ||
  visible(height, right(i, j, input)) ||
  visible(height, up(i, j, input)) ||
  visible(height, down(i, j, input));

const count2d = (matrix) =>
  matrix.reduce((acc, row) => acc + row.reduce((acc, num) => acc + num, 0), 0);

const totalVisible = count2d(map2d(visibleAllDirections, input));

const score = (height, row) => row.findIndex((num) => height <= num) + 1 || row.length;
const scoreAllDirections = (height, i, j, input) =>
  score(height, left(i, j, input)) *
  score(height, right(i, j, input)) *
  score(height, up(i, j, input)) *
  score(height, down(i, j, input));

const max2d = (matrix) => matrix.reduce((acc, row) => Math.max(acc, ...row), 0);

const maxScore = max2d(map2d(scoreAllDirections, input));

console.log(totalVisible);
console.log(maxScore);
