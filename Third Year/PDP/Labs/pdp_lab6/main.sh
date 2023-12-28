echo "Compiling - hamiltonean_cyle.cpp"
g++ -O2 -std=c++11 -pthread -Dhom -Wall hamiltonean_cycle.cpp -o hamiltonean_cycle.o
echo ""

for i in `ls input/*.txt`
do
    echo "Running test $i"
    head -n1 $i
    ./hamiltonean_cycle.o $i
    echo ""
done

rm *.o








