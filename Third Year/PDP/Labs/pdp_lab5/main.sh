echo "Compiling naive algorithm - naive_sequential.cpp"
g++ -O2 -std=c++11 -pthread -Dhom -Wall naive_sequential.cpp -o naive_1.o
echo "Compiling naive algorithm (threaded) - naive_parallel.cpp"
g++ -O2 -std=c++11 -pthread -Dhome -Wall naive_parallel.cpp -o naive_2.o
echo "Compiling karasuba algorithm - karasuba_sequential.cpp'"
g++ -O2 -std=c++11 -pthread -Dhome -Wall karasuba_sequential.cpp -o karasuba_1.o
echo "Compiling karasuba algorithm (threaded) - karasuba_parallel.cpp'"
g++ -O2 -std=c++11 -pthread -Dhome -Wall karasuba_parallel.cpp -o karasuba_2.o

echo ""

for i in `ls tests/*.in`
do
    echo "Running test $i"
    head -n1 $i
    ./naive_1.o $i
    ./naive_2.o $i
    ./karasuba_1.o $i
    ./karasuba_2.o $i
    echo ""
done

rm *.o








