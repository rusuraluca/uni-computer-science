#implementation for a simple Bag, where the elements are stored in a list.
class Bag:
    def __init__(self):
        self.__elems = []

    def add(self, elem):
        self.__elems.append(elem)

    #remove returns True if elem was removed and False otherwise
    def remove(self, elem):
        #we look for the position where the element is, and if we find it, we use del to remove it from the list
        index = 0
        while index < len(self.__elems):
            if self.__elems[index] == elem:
                del self.__elems[index]
                return True
            index = index + 1
        return False

    def search(self, elem):
        return elem in self.__elems

    def size(self):
        return len(self.__elems)

    def nrOccurrences(self, elem):
        count = 0
        for e in self.__elems:
            if e == elem:
                count = count + 1
        return count

    def iterator(self):
        return BagIterator(self)

class BagIterator:
    def __init__(self, bag):
        self.__bag = bag
        self.__currentPosition = 0

    def valid(self):
        return self.__currentPosition < self.__bag.size()

    def next(self):
        if self.__currentPosition == self.__bag.size():
            raise ValueError()
        self.__currentPosition = self.__currentPosition + 1

    def getCurrent(self):
        if self.__currentPosition == self.__bag.size():
            raise ValueError()
        #if the iterator is valid, normally we would want to return something like that
        #return self.__bag.__elems[self.__currentPosition]
        #However, this will not work, since elems in bag is private (has __ in front of it) we cannot access it from outside of class Bag
        #Interestingly, we can access it, with a special syntax, where we use the name of the class and then the name of the attribute (and some _ )
        return self.__bag._Bag__elems[self.__currentPosition]
        
        
