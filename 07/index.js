const fs = require("fs");

const input = fs.readFileSync(__dirname + "/input.txt", "utf8").split("\r\n");
// const input = fs.readFileSync(__dirname + "/test.txt", "utf8").split("\r\n");

class Node {
  constructor(name, parent, size = 0) {
    this.name = name;
    this._size = size;
    this.parent = parent;
    this.items = [];
  }

  size() {
    return this._size + this.items.reduce((acc, item) => acc + item.size(), 0);
  }
}

const root = new Node("/");
const directories = [root];

input.reduce((currentDir, item) => {
  if (item.startsWith("$ cd /")) {
    return root;
  }

  if (item.startsWith("$ cd ..")) {
    return currentDir.parent;
  }

  if (item.startsWith("$ cd")) {
    const name = item.split(" ")[2];
    return currentDir.items.find((item) => item.name === name);
  }

  if (item.startsWith("$ ls")) {
    return currentDir;
  }

  if (item.startsWith("dir")) {
    const name = item.split(" ")[1];
    const directory = new Node(name, currentDir);
    currentDir.items.push(directory);
    directories.push(directory);
  } else {
    // file
    const [size, name] = item.split(" ");
    currentDir.items.push(new Node(name, currentDir, Number(size)));
  }

  return currentDir;
}, root);

const atMost100000 = directories
  .filter((directory) => directory.size() <= 100000)
  .reduce((sum, directory) => sum + directory.size(), 0);

console.log(atMost100000);

const requiredSpace = 30000000 - (70000000 - root.size());

directories.sort((a, b) => a.size() - b.size());

const smallestToDelete = directories.find((directory) => directory.size() >= requiredSpace);

console.log(smallestToDelete.size());
