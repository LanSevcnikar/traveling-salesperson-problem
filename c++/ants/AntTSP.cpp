#include <iostream>
#include <algorithm>
#include <vector>
#include <stack>
#include <set>
#include <queue>
#include <map>
#include <fstream>
#include <math.h> 
#include <string>
 
using namespace std;
typedef long long LL;
typedef long double LD;
typedef vector<LL> vi;
 
#define inf 999999999999;
#define FOR(i,n,m) for(LL i = n; i < m; i++)
#define pb push_back
#define mp make_pair
#define fs first
#define sc second
#define sz(x) (x).size()
#define all(v) (v).begin(),(v).end()
template<typename T> void PV(T v) {
	for(const auto e : v) cout<<e<<" "; cout<<endl;
}

struct Node{
  double x, y;
  int id;
  Node(double _x, double _y, int _id){
    x = _x;
    y = _y;
    id = _id;
  }
  Node(int _id){
    id = _id;
    //choose two random doubles between 0 and 800
    x = rand() % 800;
    y = rand() % 800;
  }
  Node(){
    id = -1;
    x = -1;
    y = -1;
  }
};

double nodeDistance(Node a, Node b){
  return sqrt(pow(a.x - b.x, 2) + pow(a.y - b.y, 2));
}

double randomDouble(double mx){
    double f = (double)rand() / RAND_MAX;
    return f * (mx);
}


int n;
int nAnt, nGen;
double a, b, c, d;
double adj[50][50];
double pheromone[50][50]; 
double bestPathOfAllAntsEverDistance = 999999999;
vector<int> bestPathOfAllAntsEverPath;
vector<Node> nodes;


struct Ant{
  int currentNode;
  int visited[50];
  double totalDistance;
  vector<int> path;

  int nextNode(){
    double valueOfNode[50];
    double sum = 0;
    FOR(i,0,n){
      if(visited[i] == 0){
        valueOfNode[i] = 
          pow(pheromone[currentNode][i], a) * 
          pow((c / nodeDistance(nodes[currentNode], nodes[i])), b);
        sum += valueOfNode[i];
      }else{
        valueOfNode[i] = -1;
      }
    }
    double r = randomDouble(sum);
    FOR(i,0,n){
      if(valueOfNode[i] != -1){
        r -= valueOfNode[i];
        if(r <= 0){
          return i;
        }
      }
    }
    return -1;
  }

  void simulate(){
    currentNode = rand() % n;
    int startNode = currentNode;
    path.pb(currentNode);
    FOR(i,0,n) visited[i] = 0;
    visited[currentNode] = 1;
    double pathDistance = 0;

    FOR(i,1,n){
      int prevNode = currentNode;
      currentNode = nextNode();
      path.pb(currentNode);
      pathDistance += nodeDistance(nodes[prevNode], nodes[currentNode]);
      visited[currentNode] = 1;
    }
    pathDistance += nodeDistance(nodes[currentNode], nodes[startNode]);
    totalDistance = pathDistance;
  }
};



int main(int argc, char const *argv[]){
  if(argc != 7){
    cout << "a, b, c, d, nAnt, nGen format needed" << endl;
    return 0;
  }else{
    a    = stod(argv[1]);
    b    = stod(argv[2]);
    c    = stod(argv[3]);
    d    = stod(argv[4]);
    nAnt = stoi(argv[5]);
    nGen = stoi(argv[6]);
  }
  cin >> n;
  //set random seed to current time
  srand(time(NULL));
  
  FOR(i,0,n){
    int x, y;
    cin >> x >> y;
    nodes.pb(Node(x,y,i));
  }
  FOR(i,0,n){
    FOR(j,0,n){
      adj[i][j] = nodeDistance(nodes[i], nodes[j]);
      pheromone[i][j] = 1;
    }
  }
  
  //Generation of ants
  FOR(gen, 0, nGen){
    //All ants
    vector<Ant> ants;
    FOR(i, 0, n) FOR(j, 0, n){
      pheromone[i][j] = (1 - d) * pheromone[i][j];
    }

    FOR(i, 0, nAnt) ants.pb(Ant());
    FOR(i, 0, nAnt) ants[i].simulate();
    FOR(i, 0, nAnt){
      //cout << ants[i].totalDistance << endl;
      //PV(ants[i].path);
      FOR(e, 0, n){
        int v = ants[i].path[e];
        int u = ants[i].path[(e + 1) % n];
        pheromone[v][u] += c / ants[i].totalDistance;
        pheromone[u][v] += c / ants[i].totalDistance;
      }
    }
  }

  vector<Ant> ants;
  FOR(i, 0, nAnt) ants.pb(Ant());
  FOR(i, 0, nAnt) ants[i].simulate();
  //find best path
  int bestIndex = 0;
  int bestDistance = ants[0].totalDistance;
  FOR(i, 1, nAnt){
    if(ants[i].totalDistance < ants[bestIndex].totalDistance) {
      bestIndex = i;
      bestDistance = ants[i].totalDistance;
    }
  }
  FOR(i, 0, nAnt){
    if(ants[i].totalDistance < bestPathOfAllAntsEverDistance){
      bestPathOfAllAntsEverDistance = ants[i].totalDistance;
      bestPathOfAllAntsEverPath = ants[i].path;
    }
  }
  // FOR(i,0,n){
  //   FOR(j,0,n){
  //     cout << pheromone[i][j] << " ";
  //   }
  //   cout << endl;
  // }

  cout << bestPathOfAllAntsEverDistance << " ";
  //V(ants[bestIndex].path);  
  cout<<endl;
}