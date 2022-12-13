const fs = require("fs");

const input = fs
  .readFileSync(__dirname + "/input.txt", "utf8")
  // .readFileSync(__dirname + "/test.txt", "utf8")
  .split(/^\r\n/gm);

const parsePair = (pair) => {
  const [left, right] = pair.split("\r\n").map(parsePacket);
  return [left, right];
};

const parsePacket = (packet) => eval(packet);

const isLess = (left, right) => compare(left, right) <= 0;

const compare = (left, right) => {
  if (typeof left === "number" && typeof right === "number") return left - right;

  left = toList(left);
  right = toList(right);

  for (let i = 0; i < Math.min(left.length, right.length); i++) {
    if (compare(left[i], right[i]) < 0) return -1;
    if (compare(right[i], left[i]) < 0) return 1;
  }

  return left.length - right.length;
};

const toList = (packet) => {
  if (typeof packet === "number") return [packet];
  return packet;
};
const pairs = input.map(parsePair);

const inOrder = pairs.reduce((sum, pair, index) => {
  if (isLess(pair[0], pair[1])) return sum + index + 1;
  return sum;
}, 0);

console.log(inOrder);

const sorted = [...pairs.flat(), [[2]], [[6]]].sort((a, b) => compare(a, b));

const div2 = sorted.findIndex((item) => compare(item, [[2]]) === 0) + 1;
const div6 = sorted.findIndex((item) => compare(item, [[6]]) === 0) + 1;

console.log(div2 * div6);
