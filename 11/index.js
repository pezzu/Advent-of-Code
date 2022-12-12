const fs = require("fs");

const input = fs
  .readFileSync(__dirname + "/input.txt", "utf8")
  // .readFileSync(__dirname + "/test.txt", "utf8")
  .split(/^\r\n/gm);

const parseMonkey = (monkey) => {
  const [_, items, operation, test, ifTure, ifFalse] = monkey.slice().split("\r\n");
  return {
    items: parseItems(items).map(toRemainders),
    operation: parseOperation(operation),
    test: parseTestRemainders(test),
    evaluate: parseEvaluate(ifTure, ifFalse),
    inspected: 0,
  };
};

const parseItems = (line) => {
  return line.slice(18).split(", ").map(Number);
};

const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23];

const toRemainders = (num) => primes.map((prime) => num % prime);

const parseOperation = (line) => {
  const [operator, value] = line.slice(23).split(" ");
  switch (operator) {
    case "*":
      return value === "old" ? (old) => sqr(old) : (old) => mult(old, Number(value));
    case "+":
      return (old) => add(old, Number(value));
  }

  throw new Error("Unknown operator: " + operator);
};

const add = (item, num) => {
  return item.map((remainder, i) => (remainder + num) % primes[i]);
};

const mult = (item, num) => {
  return item.map((remainder, i) => (remainder * num) % primes[i]);
};

const sqr = (item) => {
  return item.map((remainder, i) => (remainder * remainder) % primes[i]);
};

const parseTest = (line) => {
  const value = Number(line.slice(21));
  return (level) => level % value == 0;
};

const parseTestRemainders = (line) => {
  const value = Number(line.slice(21));
  const primeIndex = primes.indexOf(value);
  if(primeIndex === -1) throw new Error("Prime out of bound " + value);
  return (level) => level[primeIndex] === 0;
};

const parseEvaluate = (ifTrue, ifFalse) => {
  const trueValue = Number(ifTrue.slice(29));
  const falseValue = Number(ifFalse.slice(30));
  return (test) => (test ? trueValue : falseValue);
};

const inspect = (monkey, item) => {
  const level = monkey.operation(item);
  monkey.inspected++;
  return level;
};

const decide = (monkey, level) => {
  const result = monkey.test(level);
  return monkey.evaluate(result);
};

const calm = (item) => {
  // return Math.floor(item / 3)
  return item;
};

const inspectAllItems = (activeMonkey, monkeys) => {
  activeMonkey.items.forEach((initial) => {
    const inspected = inspect(activeMonkey, initial);
    const calmed = calm(inspected);
    const next = decide(activeMonkey, calmed);
    monkeys[next].items.push(calmed);
  });
  activeMonkey.items = [];
  return monkeys;
};

let monkeys = input.map(parseMonkey);

const round = (monkeys) =>
  monkeys.forEach((activeMonkey, i, monkeys) => inspectAllItems(activeMonkey, monkeys));

for (let i = 0; i < 10000; i++) {
  round(monkeys);
}

const inspected = monkeys.map((monkey) => monkey.inspected);
console.log(inspected);

inspected.sort((a, b) => b - a);
console.log(inspected[0] * inspected[1]);
