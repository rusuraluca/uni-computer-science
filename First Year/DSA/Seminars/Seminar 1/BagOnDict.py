#Bag with frequencies where a dictionary is used to store the unique element - frequency pairs
class BagWithFrequencyOnDict:
    def __init__(self):
        self.__elems = {}
        

    def add(self, elem):
        #check if elem is already in the bag. If it is, increase frequency, otherwise add new element  with frequency 1
        if elem in self.__elems:
            self.__elems[elem] += 1
        else:
            self.__elems[elem] = 1

    #remove returns True if elem was removed and False otherwise
    def remove(self, elem):
        #we look for the element is, and if we find it, we decrement frequency (if it is greater than 1) or remove the element and its frequency (if the frequency would become 0)
        if elem in self.__elems:
            fr = self.__elems[elem]
            if fr > 1:
                self.__elems[elem] = fr - 1
            else:
                del self.elems[elem]
            return True
        else:
            return False

    def search(self, elem):
        return elem in self.__elems

    def size(self):
        #number of elements is the sum of frequencies
        count = 0
        for e in self.__elems.values():
            count = count + e
        return count

    def nrOccurrences(self, elem):
        if elem in self.__elems:
            return self.__elems[elem]
        else:
            return 0

    def iterator(self):
        return BagWithFrequencyOnDictIterator(self)

class BagWithFrequencyOnDictIterator:
    #current element of the iterator has to be a current element of the dictionary and the current frequency for that element
    #but how do we know which is the current element (key) of the dict? We don't have positions to go through them
    #we have the keys() function but that returns a view, which is not indexable (you cannot do bag.__elems.keys()[currentPos])
    #you can go through ALL keys by doing for key in bag.__elems.keys(), but we don't want to go through all elements at once, we want one key now, and then the next key when the next function is called again.
    #solution: use an iterator (the one provided by Python for bag.__elems.keys()) and use its __next__ function to go from one key to another
    #__next__ returns the current element and goes to the next. So we will only be able to call next once per unique element, this is why we keep the currentElement (returned by next) in an attribute.
    #__next__ raises exception when there are no more elements. We don't raise exception, we want to return True or False in valid. So we catch the exception and set a boolean flag to denote if iteration is over
    def __init__(self, bag):
        self.__bag = bag
        self.__keyIterator = bag._BagWithFrequencyOnDict__elems.keys().__iter__() # we use the iter function to create an iterator
        self.__currentFr = 1
        #we need the first key
        try:
            self.__currentKey = self.__keyIterator.__next__()
            #if next did not raise an exception, iterator is still valid
            self.__isItOver = False
        except StopIteration:
            #__next__ raised exception, meaning that the Bag is empty (there are no keys in the dictionary)
            self.__isItOver = True

    def valid(self):
        return not self.__isItOver

    def getCurrent(self):
        if self.__isItOver:
            raise ValueError()
        return self.__currentKey

    def next(self):
        if self.__isItOver:
            raise ValueError()
        #see if we can increase frequency
        if self.__currentFr < self.__bag._BagWithFrequencyOnDict__elems[self.__currentKey]:
            self.__currentFr += 1
        else:
            #we need a new key. We call __next__ for it. Remember, next can raise StopIteration if we have no more elements, and we need to check for this
            try:
                self.__currentKey = self.__keyIterator.__next__()
                self.__currentFr = 1
            except StopIteration:
                self.__isItOver = True
        
