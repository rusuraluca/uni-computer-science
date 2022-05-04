from Bag import *
from BagWithFr import *
from BagOnDict import *

def printBag(b):
    it = b.iterator()
    while it.valid():
        print(it.getCurrent())
        it.next()

def createIntBag():
    b = BagWithFrequencyOnDict() #change here the type of Bag
    for i in range(1, 5):
        for j in range(0, 5, i):
            print('Adding: ', j)
            b.add(j)
    return b

def main():
    b = createIntBag()
    printBag(b)
    print('Occurrences of 0:', b.nrOccurrences(0))
    print('Occurrences of 11: ', b.nrOccurrences(11))
    print('Remove 0: ',b.remove(0))
    print('Remove 11: ', b.remove(11))
    print('Occurrences of 0: ', b.nrOccurrences(0))
    print('Search for 4: ', b.search(4))
    print('Search for 11: ', b.search(11))
    print('Size: ', b.size())
    printBag(b)
    b2 = BagWithFrequencyOnDict() #change here the type of Bag
    print('Iterator over empty bag:  ')
    printBag(b2)


main()
