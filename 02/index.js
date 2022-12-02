const fs = require("fs");

const strategy = fs.readFileSync(__dirname + "/input.txt", "utf8").split("\r\n");

const shapeScore = { A: 1, B: 2, C: 3, X: 1, Y: 2, Z: 3 };

const outcome = (left, right) => {
  if (left === right) return 3;
  if (left === right - 1 || left === right + 2) return 6;
  return 0;
};

const round = (left, right) => {
  return shapeScore[right] + outcome(shapeScore[left], shapeScore[right]);
};

const move = (left, result) => {
  switch (result) {
    case "Y":
      return left;
    case "X":
      return left === "A" ? "C" : String.fromCharCode(left.charCodeAt(0) - 1);
    case "Z":
      return left === "C" ? "A" : String.fromCharCode(left.charCodeAt(0) + 1);
  }
  throw new Error(`Invalid result: ${result}`);
};

const points = strategy
  .map((line) => line.split(" "))
  .map(([left, result]) => [left, move(left, result)])
  .map(([left, right]) => round(left, right))
  .reduce((points, round) => points + round, 0);

console.log(points);
