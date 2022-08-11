const background_color = [50, 50, 50, 255];
let screenWidth = window.innerWidth - 275;
let screenHeight = window.innerHeight;
let screenBuffer = 50;

//class traveling salesman problem
class TSP {
  //constructor
  constructor() {
    this.nodes = [];
    this.stepCount = -1;
    this.solvingType = "";
    this.lowerBound, (this.mst = [null, null]);
    this.shortestDistance = Infinity;
    this.shortestPath = [];
  }

  optimizeSolution(alg) {
    if (alg == "opt2") {
      this.solvingType = "opt2";
    }
    if (alg == "ann") {
      this.solvingType = "ann";
      this.ann_temp = 500;
      document.getElementById("ann_temp").value = this.ann_temp;
      document.getElementById("ann_temp_2").value = this.ann_temp;
    }
  }

  solve(alg, an) {
    this.stepCount = -1;
    this.solvingType = "";
    if (alg == "naive") {
      this.solveNaive(an);
    }
    if (alg == "greedy") {
      this.solveGreedy(an);
    }
    if (alg == "dynamic") {
      this.solveDynamic(an);
    }
    if (alg == "aco") {
      this.solveACO(an);
    }
    if (alg == "random") {
      this.solveRandom(an);
    }
  }

  //function to populate nodes
  populateNodes(n, t) {
    this.nodes = generateNodes(n, t);
    this.stepCount = -1;
    this.solvingType = "";
    this.shortestDistance = Infinity;
    this.shortestPath = [];
    [this.lowerBound, this.mst] = findMST(this.nodes);
  }

  //function to draw all nodes
  drawNodes() {
    for (let i = 0; i < this.nodes.length; i++) {
      this.nodes[i].draw();
    }
    if (document.getElementById("showMST").checked) {
      this.drawMST();
    }
    //draw an eclipse where node 0 is
    fill(255, 0, 0, 255);
    ellipse(this.nodes[0].x, this.nodes[0].y, 30, 30);
  }

  optimizing2() {
    //console.log("Hello")
    let before = evalPath(this.shortestPath);
    for (let i = 1; i < this.shortestPath.length; i++) {
      for (let j = i + 2; j < this.shortestPath.length; j++) {
        let temp = [];
        for (let index = 0; index < i; index++) {
          temp.push(this.shortestPath[index]);
        }
        for (let index = j - 1; index >= i; index--) {
          temp.push(this.shortestPath[index]);
        }
        for (let index = j; index < this.shortestPath.length; index++) {
          temp.push(this.shortestPath[index]);
        }
        let after = evalPath(temp);
        //console.log(before, after);
        if (after < before) {
          //console.log("heh")
          this.shortestPath = [...temp];
          return true;
        }
      }
    }
    for (let i = 2; i < this.shortestPath.length; i++) {
      let temp = [this.shortestPath[0]];
      for (let index = i; index < this.shortestPath.length; index++) {
        temp.push(this.shortestPath[index]);
      }
      for (let index = i - 1; index > 0; index--) {
        temp.push(this.shortestPath[index]);
      }
      let after = evalPath(temp);
      if (after < before) {
        this.shortestPath = [...temp];
        return true;
      }
    }
    //console.log("Goodbye")
    return false;
  }

  nextStep() {
    if (this.solvingType == "opt2") {
      if (this.optimizing2() == false) {
        this.solvingType = "";
      }
    }
    if (this.solvingType == "ann") {
      this.simulateAnnealing();
    }

    if (this.stepCount != -1) {
      this.stepCount++;
      if (this.solvingType == "naive") {
        if (this.stepCount == this.allPermutationsOfNodes.length) {
          this.stepCount = -1;
          this.solvingType = "";
        } else {
          this.evaluatePermutation(this.allPermutationsOfNodes[this.stepCount]);
        }
      }
      if (this.solvingType == "greedy") {
        this.nextGreedyMove();
        if (this.stepCount == this.nodes.length) {
          this.stepCount = -1;
          this.solvingType = "";
        }
        this.calculateShortestDistance();
      }
      if (this.solvingType == "aco") {
        this.updateAntColonies();
        if (this.stepCount > 10000000) {
          this.stepCount = -1;
          this.solvingType = "";
        }
      }
      if (this.solvingType == "random") {
        let randomNode;
        do {
          randomNode =
            this.nodes[Math.floor(Math.random() * this.nodes.length)];
        } while (this.shortestPath.includes(randomNode));
        this.shortestPath.push(randomNode);
        this.calculateShortestDistance();
        if (this.shortestPath.length == this.nodes.length) {
          this.stepCount = -1;
          this.solvingType = "";
        }
      }
    }
    this.calculateShortestDistance();
  }

  simulateAnnealing() {
    if (this.shortestPath.length == 0) {
      return;
    }
    this.ann_temp = document.getElementById("ann_temp").value;
    this.ann_temp =
      this.ann_temp * (1 - document.getElementById("ann_temp_delta").value);
    //console.log(this.ann_temp.toFixed(1))
    document.getElementById("ann_temp").value = this.ann_temp;
    document.getElementById("ann_temp_2").value = this.ann_temp;

    if (document.getElementById("ann_type").value == "v") {
      //loop 10 times
      for (let k = 0; k < 10; k++) {
        let before = evalPath(this.shortestPath);
        let newPath = [...this.shortestPath];
        //choose two random verticies and swap them
        let i = Math.floor(Math.random() * this.shortestPath.length);
        let j = Math.floor(Math.random() * this.shortestPath.length);
        let temp = newPath[i];
        newPath[i] = newPath[j];
        newPath[j] = temp;
        let after = evalPath(newPath);
        if (after - before < this.ann_temp) {
          this.shortestPath = [...newPath];
        }
      }
    } else {
      //loop 10 times
      //choose two random verticies i and j where j is at least i + 2
      let before = evalPath(this.shortestPath);
      let b = false;
      let count = 0;
      do {
        count++;
        let i = Math.floor(Math.random() * (this.shortestPath.length - 2));
        let j = Math.floor(
          Math.random() * (this.shortestPath.length - i - 1) + i + 2
        );
        let temp = [];
        if (j - i < 2) console.log(i, j);
        for (let index = 0; index < i; index++) {
          temp.push(this.shortestPath[index]);
        }
        for (let index = j - 1; index >= i; index--) {
          temp.push(this.shortestPath[index]);
        }
        for (let index = j; index < this.shortestPath.length; index++) {
          temp.push(this.shortestPath[index]);
        }
        //console.log(temp)
        let after = evalPath(temp);
        if (after - before < this.ann_temp) {
          this.shortestPath = [...temp];
          b = true;
        }
      } while (!b && count < 1000);
    }
  }

  calculateShortestDistance() {
    this.shortestDistance = 0;
    for (let i = 0; i < this.shortestPath.length; i++) {
      this.shortestDistance += this.shortestPath[i].distanceTo(
        this.shortestPath[(i + 1) % this.shortestPath.length]
      );
    }
  }

  evaluatePermutation(permutation) {
    drawPath(permutation);
    let distance = 0;
    for (let i = 0; i < permutation.length - 1; i++) {
      distance += permutation[i].distanceTo(permutation[i + 1]);
    }
    distance += permutation[permutation.length - 1].distanceTo(permutation[0]);
    if (distance < this.shortestDistance) {
      this.shortestDistance = distance;
      this.shortestPath = permutation;
    }
  }

  drawShortestPath() {
    drawPath(this.shortestPath, 2, [255, 0, 0, 255]);
  }

  //solve naive function
  solveNaive(isAnimated) {
    findShortestPathDynamic(this.nodes);
    this.allPermutationsOfNodes = permutations(this.nodes);
    if (!this.allPermutationsOfNodes) return;
    this.shortestDistance = Infinity;
    this.shortestPath = [];
    if (isAnimated) {
      this.stepCount = 0;
      this.solvingType = "naive";
    } else {
      //solve tsp with brute force
      for (let i = 0; i < this.allPermutationsOfNodes.length; i++) {
        this.evaluatePermutation(this.allPermutationsOfNodes[i]);
      }
    }
  }

  nextGreedyMove() {
    let nextNode = closestNodeToNodeNotINArray(
      this.currentNode,
      this.shortestPath,
      this.nodes
    );
    this.shortestPath.push(this.currentNode);
    this.currentNode = nextNode;
  }

  solveGreedy(isAnimated) {
    this.shortestDistance = Infinity;
    this.shortestPath = [];
    this.currentNode =
      this.nodes[Math.floor(Math.random() * this.nodes.length)];
    if (isAnimated) {
      this.stepCount = 0;
      this.solvingType = "greedy";
    } else {
      //solve tsp with greedy algorithm
      for (let i = 0; i < this.nodes.length; i++) {
        this.nextGreedyMove();
      }
      this.calculateShortestDistance();
    }
  }

  drawMST() {
    for (let i = 0; i < this.mst.length; i++) {
      let [u, v] = this.mst[i];
      stroke(0, 255, 0);
      line(this.nodes[u].x, this.nodes[u].y, this.nodes[v].x, this.nodes[v].y);
    }
  }

  solveDynamic(isAnimated) {
    if (this.nodes.length > 20) {
      alert("20 is the max for a reasonable solution of this type");
      return;
    }
    this.shortestDistance = Infinity;
    this.shortestPath = [];
    if (isAnimated) {
      alert(
        "There is no animation for the DP solution to this, it would look almost exactly the same as the naive solution"
      );
    }
    let tempPath = [];
    [this.shortestDistance, tempPath] = findShortestPathDynamic(this.nodes);
    this.shortestPath = [];
    for (let i = 0; i < tempPath.length; i++) {
      this.shortestPath.push(this.nodes[tempPath[i]]);
    }
  }

  solveRandom(isAnimated) {
    this.shortestDistance = Infinity;
    this.shortestPath = [];
    if (isAnimated) {
      this.stepCount = 0;
      this.solvingType = "random";
    } else {
      while (this.shortestPath.length != this.nodes.length) {
        let randomNode;
        do {
          randomNode =
            this.nodes[Math.floor(Math.random() * this.nodes.length)];
        } while (this.shortestPath.includes(randomNode));
        this.shortestPath.push(randomNode);
        this.calculateShortestDistance();
      }
    }
  }

  updateAntColonies() {
    this.ant_r = simulateNAnts(
      this.ant_d,
      this.ant_r,
      this.ant_alpha,
      this.ant_beta,
      this.ant_decay,
      this.ant_number_of_ants,
      this.nodes
    );
    let curr = 0;
    let visited = new Set();
    this.shortestPath = [];
    while (visited.size != this.nodes.length) {
      visited.add(curr);
      this.shortestPath.push(this.nodes[curr]);
      let minn = -Infinity;
      let minnIndex = -1;
      for (let i = 0; i < this.nodes.length; i++) {
        if (!visited.has(i)) {
          let value =
            Math.pow(
              this.ant_r[i][curr],
              document.getElementById("ant_alpha").value
            ) /
            Math.pow(
              this.ant_d[i][curr],
              document.getElementById("ant_beta").value
            );
          if (value > minn) {
            minn = value;
            minnIndex = i;
          }
        }
      }
      curr = minnIndex;
    }
    this.calculateShortestDistance();
  }

  solveACO(isAnimated) {
    this.ant_alpha = document.getElementById("ant_alpha").value;
    this.ant_beta = document.getElementById("ant_beta").value;
    this.ant_decay = document.getElementById("ant_decay").value;
    this.ant_number_of_ants = document.getElementById("ant_number").value;

    this.shortestDistance = Infinity;
    this.shortestPath = [];
    this.stepCount = 0;
    this.solvingType = "aco";
    this.ant_d = [];
    this.ant_r = [];
    for (let i = 0; i < this.nodes.length; i++) {
      this.ant_d.push([]);
      this.ant_r.push([]);
      for (let j = 0; j < this.nodes.length; j++) {
        this.ant_d[i].push(this.nodes[i].distanceTo(this.nodes[j]));
        this.ant_r[i].push(1);
      }
    }
    if (!isAnimated) {
      alert("only in animated does it work");
    }
  }
}

//function to find the minimal spanning tree for a set of nodes
function findMST(nodes) {
  let parent = [];
  for (let i = 0; i < nodes.length; i++) {
    parent[i] = i;
  }
  let mst = [];
  let mstWeight = 0;
  let edges = [];
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      edges.push([i, j, nodes[i].distanceTo(nodes[j])]);
    }
  }
  //sort edges by the last element
  edges.sort(function (a, b) {
    return a[2] - b[2];
  });

  function find(v) {
    if (v == parent[v]) {
      return v;
    }
    parent[v] = find(parent[v]);
    return find(parent[v]);
  }

  function union(u, v) {
    let rootU = find(u);
    let rootV = find(v);
    if (rootU != rootV) {
      parent[rootU] = rootV;
    }
  }

  for (let i = 0; i < edges.length; i++) {
    let [u, v, w] = edges[i];
    if (find(u) != find(v)) {
      mst.push([u, v]);
      mstWeight += w;
      union(u, v);
    }
  }

  //draw mst

  return [mstWeight, mst];
}

function findPerfectMatching(nodes){
  
}

function evalPath(path) {
  total = 0;
  for (let i = 0; i < path.length; i++) {
    total += path[i].distanceTo(path[(i + 1) % path.length]);
  }
  return total;
}

function findShortestPathDynamic(nodes) {
  let s = 0;
  let d = [];
  for (let i = 0; i < nodes.length; i++) {
    d[i] = [];
    for (let j = 0; j < nodes.length; j++) {
      d[i][j] = nodes[i].distanceTo(nodes[j]);
    }
  }

  let DP = {};
  for (let i = 0; i < nodes.length; i++) {
    DP[i] = {};
  }

  function intHas(bitmask, i) {
    return (bitmask & (1 << i)) !== 0;
  }

  function intAdd(bitmask, i) {
    return bitmask | (1 << i);
  }

  function intRemove(bitmask, i) {
    return bitmask & ~(1 << i);
  }

  function tsp(curr, visited) {
    if (visited == (1 << nodes.length) - 1) {
      DP[curr][visited] = null;
      return [d[curr][0], null];
    }

    if (DP[curr][visited] != undefined) {
      return DP[curr][visited];
    }

    let ans = 100000000;
    let next = null;
    for (let i = 0; i < nodes.length; i++) {
      if (i != curr && !intHas(visited, i)) {
        visited = intAdd(visited, i);
        let [res, something] = tsp(i, visited);
        if (ans > res + d[curr][i]) {
          ans = res + d[curr][i];
          next = i;
        }
        visited = intRemove(visited, i);
      }
    }
    DP[curr][visited] = [ans, next];
    return [ans, next];
  }

  let [ans, next] = tsp(s, 1);
  let path = [];
  let curr = 0;
  let bitmap = 1;
  do {
    path.push(curr);
    curr = DP[curr][bitmap];
    if (curr != null) {
      curr = curr[1];
      bitmap = intAdd(bitmap, curr);
    }
  } while (curr != null);
  return [ans, path];
}

//class node, having an x and y coordinate as well as draw function
class Node {
  //constructor function
  constructor(x, y, id) {
    this.x = x;
    this.y = y;
    this.id = id;
  }

  //draw function
  draw() {
    //set radious to the inverse of the logarithm of the number of all nodes
    let r = 20 / Math.log(tsp.nodes.length) / Math.log(2);
    //draw a circle at the x and y coordinate
    fill(255, 255, 255, 255);
    ellipse(this.x, this.y, r, r);
  }

  //distanceTo function
  distanceTo(node) {
    //return the distance between two nodes
    return sqrt(pow(this.x - node.x, 2) + pow(this.y - node.y, 2));
  }
}

//function to generate an array of n nodes
function generateNodes(n, t) {
  if (t == "random") {
    let nodes = [];
    for (let i = 0; i < n; i++) {
      let x = random(screenWidth - screenBuffer * 2);
      let y = random(screenHeight - screenBuffer * 2);
      //check if any node is within the radius of another node
      let r = 20;
      for (let j = 0; j < nodes.length; j++) {
        if (sqrt(pow(x - nodes[j].x, 2) + pow(y - nodes[j].y, 2)) < 2 * r) {
          x = random(screenWidth - screenBuffer * 2);
          y = random(screenHeight - screenBuffer * 2);
          j = 0;
        }
      }
      nodes.push(new Node(x + screenBuffer, y + screenBuffer, i));
    }
    return nodes;
  }
  if (t == "smallworld") {
    let m = Math.floor(Math.sqrt(n) / 2);
    let cities = [];
    let nodes = [];
    for (let index = 0; index < m; index++) {
      let x = random(screenWidth - screenBuffer * 2) + screenBuffer;
      let y = random(screenHeight - screenBuffer * 2) + screenBuffer;
      cities.push(new Node(x, y, index));
    }

    for (let index = 0; index < n; index++) {
      //choose random city
      let city = cities[Math.floor(Math.random() * cities.length)];
      //chose random x and y offset smaller than screen divided by m
      let x = random(-100, 100);
      let y = random(-100, 100);;
      do {
        //if x or y outside of screen, choose new ones
        if (
          city.x + x < screenBuffer ||
          city.x + x > screenWidth - screenBuffer
        ) {
          x = random(-screenWidth / m, screenWidth / m);
        }
        if (
          city.y + y < screenBuffer ||
          city.y + y > screenHeight - screenBuffer
        ) {
          y = random(-screenHeight / m, screenHeight / m);
        }
      } while (
        city.x + x < screenBuffer ||
        city.x + x > screenWidth - screenBuffer ||
        city.y + y < screenBuffer ||
        city.y + y > screenHeight - screenBuffer
      );
      //create a node at that position
      nodes.push(new Node(city.x + x, city.y + y, index));
    }
    console.log(cities, nodes);
    return nodes;
  }
}

//function that takes as input an array and returns all permutations of it
function permutations(inputArr) {
  if (inputArr.length > 8) {
    //make a window popup saying that 10 is the max
    alert("8 is the max");
    return;
  }
  var results = [];
  function permute(arr, memo) {
    var cur,
      memo = memo || [];

    for (var i = 0; i < arr.length; i++) {
      cur = arr.splice(i, 1);
      if (arr.length === 0) {
        results.push(memo.concat(cur));
      }
      permute(arr.slice(), memo.concat(cur));
      arr.splice(i, 0, cur[0]);
    }
    return results;
  }
  //filter out all permutations that do not start with the first node
  return permute(inputArr).filter(function (permutation) {
    return permutation[0] == inputArr[0];
  });
}

function closestNodeToNodeNotINArray(node, array, nodes) {
  let closestNode = null;
  let closestDistance = Infinity;
  for (let i = 0; i < nodes.length; i++) {
    if (node != nodes[i] && array.indexOf(nodes[i]) == -1) {
      let distance = node.distanceTo(nodes[i]);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestNode = nodes[i];
      }
    }
  }
  return closestNode;
}

function drawPath(path, sw, sc) {
  if (!sw) sw = 1;
  if (!sc) sc = [255, 255, 255, 255];
  if (!path || path.length < 2) return;
  //draw a line between each node in the path
  for (let i = 0; i < path.length - 1; i++) {
    stroke(sc);
    strokeWeight(sw);
    line(path[i].x, path[i].y, path[i + 1].x, path[i + 1].y);
  }
  line(path[0].x, path[0].y, path[path.length - 1].x, path[path.length - 1].y);
}

let tsp = new TSP();
let solvingType = "";

//p5js setup function

let canvas; 
function setup() {
  frameRate(20);
  tsp.populateNodes(10, "random");
  canvas = createCanvas(screenWidth, screenHeight);
  background(background_color);
  canvas.parent('right-container');

}

//p5js draw function
function draw() {
  background(background_color);
  frameRate(parseInt(document.getElementById("speed").value));
  //display framerate on screen

  tsp.drawNodes();
  tsp.nextStep();
  tsp.drawShortestPath();

  //DEBUGGING INFO
  fill(255, 255, 255, 255);
  noStroke();
  textSize(20);
  text("FPS: " + frameRate().toFixed(2), 10, 20);
  //display tsp.shortestpath on screen rounded to two decimals
  if (tsp.shortestDistance) {
    text("Shortest Path: " + tsp.shortestDistance.toFixed(2), 10, 40);
  }
  text("Lower bound: " + tsp.lowerBound.toFixed(2), 10, 60);
  //display ratio between lower bound and shortest path on screen rounded to two decimals
  if (tsp.shortestDistance) {
    text(
      "Ratio: " + (tsp.shortestDistance / tsp.lowerBound).toFixed(2),
      10,
      80
    );
  }

  if (document.getElementById("algorithm").value == "aco") {
    document.getElementById("acoInput").style.display = "inline";
  } else {
    document.getElementById("acoInput").style.display = "none";
  }

  if (document.getElementById("opt_alg").value == "ann") {
    document.getElementById("annInput").style.display = "inline";
  } else {
    document.getElementById("annInput").style.display = "none";
  }
}

//function on window resize p5js
function windowResized() {
  screenHeight = window.innerHeight;
  screenWidth = window.innerWidth - 275;
  resizeCanvas(screenWidth, screenHeight);
  
}

function updateAnnTemp(){
  document.getElementById('ann_temp_2').value = document.getElementById('ann_temp').value   

}