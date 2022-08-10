function antColonyOpt(nodes, alpha, beta, decay, _n, _m) {
  //
  let d = [];
  let r = [];
  for (let i = 0; i < nodes.length; i++) {
    d.push([]);
    r.push([]);
    for (let j = 0; j < nodes.length; j++) {
      d[i].push(nodes[i].distanceTo(nodes[j]));
      r[i].push(1);
    }
  }

  function simulateNAntsForMRounds(n, m) {
    for (let round = 0; round < m; round++) {
      let _r = [];
      for (let i = 0; i < nodes.length; i++) {
        _r.push([]);
        for (let j = 0; j < nodes.length; j++) {
          _r[i].push(0);
        }
      }

      let P = [];
      for (let i = 0; i < nodes.length; i++) {
        P.push([]);
        let temp = 0;
        for (let j = 0; j < nodes.length; j++) {
          let value = Math.pow(r[i][j], beta) / Math.pow(d[i][j], alpha);
          P[i].push(value);
          temp += value;
        }
      }
      //console.log(P);

      function simAnt(start, curr, visited) {
        //console.log(start, curr, visited);
        if (visited.size == nodes.length) {
          return [d[start][curr], [curr]];
        }
        //select random number between 1 and n that is not in set visited
        let nextOption = [];
        let sumOfIn = 0;

        for (let i = 0; i < nodes.length; i++) {
          if (!visited.has(i)) {
            nextOption.push([i, P[curr][i]]);
            sumOfIn += P[curr][i];
          }
        }

        let rand = Math.random() * sumOfIn;
        //console.log(nextOption, sumOfIn, rand);
        for (let i = 0; i < nextOption.length; i++) {
          rand -= nextOption[i][1];
          if (rand <= 0) {
            let pathFromHere = [];
            let totalPath = 0;
            [totalPath, pathFromHere] = simAnt(
              start,
              nextOption[i][0],
              visited.add(nextOption[i][0])
            );
            pathFromHere.push(curr);
            return [totalPath + d[curr][nextOption[i][0]], pathFromHere];
          }
        }
      }

      for (let ant = 0; ant < n; ant++) {
        let start = Math.floor(Math.random() * nodes.length);
        let visited = new Set();
        visited.add(start);
        let total = 0;
        let pathOfAnt = [];
        //console.log(simAnt(start, start, visited));
        [total, pathOfAnt] = simAnt(start, start, visited);
        //console.log("path of ant", pathOfAnt);

        for (let i = 1; i < pathOfAnt.length; i++) {
          _r[pathOfAnt[i]][pathOfAnt[i - 1]] += 1 / total;
        }
      }
      for (let i = 0; i < nodes.length; i++) {
        for (let j = 0; j < nodes.length; j++) {
          r[i][j] = (1 - decay) * r[i][j] + _r[i][j];
        }
      }
    }
  }

  simulateNAntsForMRounds(_n, _m);
  let curr = 0;
  let path = [];
  let total = 0;
  let visited = new Set();
  visited.add(curr);
  while (visited.size != nodes.length) {
    path.push(curr);
    //find node that has not been visited yet with the highest value in r
    minn = -10000;
    node = null;
    for (let i = 0; i < nodes.length; i++) {
      if (!visited.has(i) && r[curr][i] > minn) {
        minn = r[curr][i];
        node = i;
      }
    }
    total += d[curr][node];
    curr = node;
    visited.add(curr);
  }
  path.push(curr);
  //console.log(visited);
  total += d[curr][path[0]];
  //console.log(total, path);
  let fixedPath = [];
  for (let i = 0; i < path.length; i++) {
    fixedPath.push(nodes[path[i]]);
  }
  return [total, fixedPath];
}

function simulateNAnts(d, r, a, b, g, n, nodes) {
  a = document.getElementById("ant_alpha").value;
  b = document.getElementById("ant_beta").value;
  g = document.getElementById("ant_decay").value;
  c = document.getElementById("ant_c").value;
  n = document.getElementById("ant_number").value;
  
  let p = [];
  let newR = [];
  for (let i = 0; i < d.length; i++) {
    p.push([]);
    newR.push([]);
    for (let j = 0; j < d.length; j++) {
      p[i].push(Math.pow(r[i][j], a) / Math.pow(d[i][j], b));
      newR[i].push(r[i][j] * (1-g));
    }
  }

  //given the current node and the visited nodes, find the next node to visit
  function chooseNext(curr, visited) {
    let nextOption = [];
    let sumOfIn = 0;
    //checks all that are an option
    for (let i = 0; i < nodes.length; i++) {
      if (!visited.has(i)) {
        nextOption.push([i, p[curr][i]]);
        sumOfIn += p[curr][i];
      }
    }
    let rand = Math.random() * sumOfIn;
    for (let i = 0; i < nextOption.length; i++) {
      rand -= nextOption[i][1];
      if (rand <= 0) {
        return nextOption[i][0];
      }
    }
  }

  function simAnt(start, curr, visited) {
    if (visited.size == nodes.length) {
      return [d[start][curr], [curr]];
    }
    let next = chooseNext(curr, visited);
    let total = 0;
    let path = [];
    [total, path] = simAnt(start, next, visited.add(next));
    path.push(curr);
    return [total + d[curr][next], path];
  }

  for (let k = 0; k < n; k++) {
    let start = 0;
    let visited = new Set();
    visited.add(start);
    let total = 0;
    let path = [];
    [total, path] = simAnt(start, start, visited);
    for (let i = 1; i < path.length; i++) {
      newR[path[i]][path[i - 1]] += c / total;
    }
  }

  console.log(newR);
  stroke(100);
  if (document.getElementById("ant_showTrails").checked) {
    for (let i = 0; i < nodes.length; i++) {
      for (let j = 0; j < nodes.length; j++) {
        strokeWeight(newR[i][j] * 10);
        line(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y);
      }
    }
  }
  return newR;
}
