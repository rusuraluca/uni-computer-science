echo "Compiling - hamiltonean_cyle.cpp"
g++ -O2 -std=c++11 -pthread -Dhom -Wall hamiltonean_cycle.cpp -o hamiltonean_cycle.o
echo "Compiling - hamiltonean_cyle_boolean.cpp"
g++ -O2 -std=c++11 -pthread -Dhom -Wall hamiltonean_cycle_boolean.cpp -o hamiltonean_cycle_boolean.o

echo ""

for i in `ls input/*.in`
do
    echo "Running test $i"
    head -n1 $i
    ./hamiltonean_cycle.o $i
    ./hamiltonean_cycle_boolean.o $i
    echo ""
done

rm *.o








