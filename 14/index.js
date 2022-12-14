const fs = require("fs");

const input = fs
  .readFileSync(__dirname + "/input.txt", "utf8")
  // .readFileSync(__dirname + "/test.txt", "utf8")
  .split("\r\n");

const parsePoint = (point) => {
  const [x, y] = point.split(",").map(Number);
  return [x, y];
};

const parsePath = (line) => {
  const points = line.split(" -> ").map(parsePoint);
  return points;
};

const straight = (start, end) => {
  const [x1, y1] = start;
  const [x2, y2] = end;

  const rocks = [];

  if (x1 === x2) {
    for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++) {
      rocks.push([x1, y]);
    }
  } else {
    for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++) {
      rocks.push([x, y1]);
    }
  }

  return rocks;
};

const expandPath = (path) => {
  return path.reduce((rocks, point, index) => {
    if (index === 0) return [point];
    return [...rocks, ...straight(path[index - 1], point)];
  }, []);
};

const findNext = (point, rocks) => {
  const [x, y] = point;

  const nextPoints = [
    [x, y + 1],
    [x - 1, y + 1],
    [x + 1, y + 1],
  ];

  for (const nextPoint of nextPoints) {
    if (rocks.has(JSON.stringify(nextPoint))) continue;
    return nextPoint;
  }

  return null;
};

const addRock = (point, rocks) => {
  rocks.add(JSON.stringify(point));
};

const findRestPoint = (point, rocks, voidLevel) => {
  let nextPoint = null;

  while (true) {
    nextPoint = findNext(point, rocks);

    if (!nextPoint) {
      return point;
    }

    if (nextPoint[1] >= voidLevel) {
      return null;
    }
    point = nextPoint;
  }
};

const paths = input.map(parsePath);

const rocks = paths.flatMap(expandPath);
const bottom = rocks.reduce((max, point) => Math.max(max, point[1]), 0);

const filled = new Set(rocks.map(JSON.stringify));

const start = [500, 0];

let count = 0;

while (true) {
  let point = start;
  const restPoint = findRestPoint(point, filled, bottom);

  if (!restPoint) break;

  count++;
  addRock(restPoint, filled);
}

console.log(count);
// console.log(rocks);
