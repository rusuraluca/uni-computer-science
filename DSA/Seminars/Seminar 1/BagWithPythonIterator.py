#Bag with frequencies and with Python-style iterator (iterator is not a separate class)
#implementation for a Bag with frequencies, where the elements are stored in two lists: one with unique elements and one with frequencies
class BagWithFrequency2:
    def __init__(self):
        self.__elems = []
        self.__frequencies = []

    def add(self, elem):
        #check if elem is already in the bag. If it is, increase frequency, otherwise add new element  with frequency 1
        found = False
        index = 0
        while index < len(self.__elems) and not found:
            if self.__elems[index] == elem:
                self.__frequencies[index] += 1
                found = True
            index = index + 1
        if not found:
            self.__elems.append(elem)
            self.__frequencies.append(1)

    #remove returns True if elem was removed and False otherwise
    def remove(self, elem):
        #we look for the position where the element is, and if we find it, we decrement frequency (if it is greater than 1) or remove the element and its frequency (if the frequency would become 0)
        index = 0
        while index < len(self.__elems):
            if self.__elems[index] == elem:
                if self.__frequencies[index] > 1:
                    self.__frequencies[index] -= 1
                else:
                    del self.__elems[index]
                    del self.__frequencies[index]
                return True
            index = index + 1
        return False

    def search(self, elem):
        return elem in self.__elems

    def size(self):
        #number of elements is the sum of frequencies
        count = 0
        for e in self.__frequencies:
            count = count + e
        return count

    def nrOccurrences(self, elem):
        found = False
        index = 0
        count = 0
        while index < len(self.__elems) and not found:
            if self.__elems[index] == elem:
                count = self.__frequencies[index]
                found = True
            index = index + 1
        return count

    def __iter__(self):
        self.__currentPos = 0
        self.__currentFr = 1
        return self

    def __next__(self):
        if self.__currentPos == len(self.__elems):
            raise StopIteration
        currentElem = self.__elems[self.__currentPos]
        if self.__currentFr < self.__frequencies[self.__currentPos]:
            self.__currentFr += 1
        else:
            self.__currentPos += 1
            self.__currentFr = 1
        return currentElem
        

        
        
