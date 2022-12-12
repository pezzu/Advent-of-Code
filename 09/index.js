const fs = require("fs");

const input = fs
  .readFileSync(__dirname + "/input.txt", "utf8")
  // .readFileSync(__dirname + "/test.txt", "utf8")
  .split("\r\n");

let visited = new Set();
visited.add([0, 0].join(","));

let rope = Array.from({ length: 10 }, () => [0, 0]);

const parse = (line) => {
  const [direction, distance] = line.split(" ");
  return [direction, parseInt(distance)];
};

const toSteps = ([direction, distance]) => {
  const steps = Array.from({ length: distance });
  switch (direction) {
    case "U":
      return steps.map(() => [0, 1]);
    case "D":
      return steps.map(() => [0, -1]);
    case "L":
      return steps.map(() => [-1, 0]);
    case "R":
      return steps.map(() => [1, 0]);
  }
};

const visit = (rope) => {
  visited.add(rope[rope.length - 1].join(","));
};

const moveHead = (rope, step) => {
  const [head, ...tail] = rope;
  const newHead = [head[0] + step[0], head[1] + step[1]];
  return [newHead, ...tail];
};

const pullRest = (rope) =>
  rope.map((knot, i, rope) => {
    if (i === 0) return knot;
    return pull(rope[i - 1], knot);
  });

const move = (rope, step) => {
  const head = moveHead(rope, step);
  return pullRest(head);
};

const pull = (head, tail) => {
  const xDiff = head[0] - tail[0];
  const yDiff = head[1] - tail[1];
  if (xDiff === 0) {
    return [tail[0], tail[1] + Math.sign(yDiff) * (Math.abs(yDiff) - 1)];
  } else if (yDiff === 0) {
    return [tail[0] + Math.sign(xDiff) * (Math.abs(xDiff) - 1), tail[1]];
  } else if (Math.abs(xDiff) > 1 || Math.abs(yDiff) > 1) {
    return [tail[0] + Math.sign(xDiff), tail[1] + Math.sign(yDiff)];
  }
  return tail;
};

const steps = input.map(parse).map(toSteps).flat();

steps
  .reduce((ropes, step) => [...ropes, move(ropes[ropes.length - 1], step)], [rope])
  .forEach(visit);

console.log(visited.size);
