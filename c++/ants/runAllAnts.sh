read -r -s -p varM
read -r -s -p varA
read -r -s -p varB
read -r -s -p varC
read -r -s -p varD
for i in $(seq 1 $varM)
do
  echo $varM $varA $varB $varC $varD $i
  ./AntTSP $varA $varB $varC $varD 150 50 < "../input/nodes$i.txt" > "temp/result$i.txt" 
  # echo "Solved $i-th instance"
done