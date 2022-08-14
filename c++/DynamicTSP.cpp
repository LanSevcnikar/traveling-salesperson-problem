#include <iostream>
#include <algorithm>
#include <vector>
#include <stack>
#include <set>
#include <queue>
#include <map>
#include <fstream>
#include <string.h>
#include <math.h> 
 
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

struct Visited{
  int visited = 0;
  Visited(int v){
    visited = (1 << v);
  }
  bool hasVisited(int v){
    return (visited & (1 << v)) != 0;
  }

  void addNode(int v){
    visited |= (1 << v);
  }

  void removeNode(int v){
    visited &= ~(1 << v);
  }
};

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

double distanceBetweenNodes(Node a, Node b){
  return sqrt(pow(a.x - b.x, 2) + pow(a.y - b.y, 2));
}

int n;
vector<Node> nodes;
double adj[50][50];
double DP[50][3000000];
int nxt[50][3000000];

double solve(int curr, Visited visited){
  if(DP[curr][visited.visited] != -1){
    return DP[curr][visited.visited];
  }
  if(visited.visited == (1 << n) - 1){
    return adj[curr][0];
  }

  double mn = 10000000;
  int nextNode = -1;
  for(int i = 0; i < n; i++){
    if(visited.hasVisited(i)){
      continue;
    }
    visited.addNode(i);
    double dist = adj[curr][i] + solve(i, visited);
    if(dist < mn){
      mn = dist;
      nextNode = i;
    }
    visited.removeNode(i);
  }

  DP[curr][visited.visited] = mn;
  nxt[curr][visited.visited] = nextNode;
  return mn;
}

int main(int argc, char const *argv[]){
  cin >> n;  

  nodes.clear();
  FOR(i,0,n){
    int x, y, id = i;
    cin >> x >> y;
    nodes.pb(Node(x, y, id));
  }

  FOR(i,0,n){
    FOR(j,0,n){
      adj[i][j] = distanceBetweenNodes(nodes[i], nodes[j]);
    }
  }
  FOR(i,0,25){
    FOR(j,0,3000000){
      DP[i][j] = -1;
      nxt[i][j] = -1;
    }
  }


  cout << solve(0, Visited(0)) << " ";
  
  // vector<Node> path;
  // int curr = 0;
  // Visited visited(0);

  // while(true){
  //   path.pb(nodes[curr]);
  //   curr = nxt[curr][visited.visited];
  //   if(curr == -1) break;
  //   visited.addNode(curr);
  // }

  // for(auto e : path){
  //   cout << e.id << " ";
  // }

  cout<<endl;
}