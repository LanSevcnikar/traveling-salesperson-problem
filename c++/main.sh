varN = 15
varM = 100

# GENERATE NODES
echo "Generating nodes"
g++ GenerateNodes.cpp -o GenerateNodes
for i in $(seq 1 $varM)
do
  ./GenerateNodes $varN $varX > "input/nodes$i.txt"
done
echo "Done generating nodes"

# FIND OPTIMAL SOLUTIONS
echo "Solving Dynamically"
g++ DynamicTSP.cpp -o DynamicTSP
for i in $(seq 1 $varM)
do
  ./DynamicTSP < "input/nodes$i.txt" > "outputDynamic/result$i.txt" 
  echo "Solved $i-th instance"
done
echo "Done solving dynamically"

# TRAIN ANTS
echo "Going to train ANTS"
g++ ants/AntTSP.cpp -o ants/AntTSP
g++ ants/trainAnts.cpp -o ants/trainAnts

echo "Solving ANT"
for i in $(seq 1 $varM)
do
  ./AntTSP 1 2 1 0.002 200 80 < "input/nodes$i.txt" > "outputAnt/result$i.txt" 
  echo "Solved $i-th instance"
done
echo "Done solving ANT"

for i in $(seq 1 $varM)
do
  echo "Dynamic: "
  cat "outputDynamic/result$i.txt"
  echo "ANT: "
  cat "outputAnt/result$i.txt"
done