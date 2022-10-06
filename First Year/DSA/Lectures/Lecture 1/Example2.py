import random
from timeit import default_timer as timer

'''
Counts how many elements from list l can be found in the container
'''
def testContainer(container, l):
    count = 0
    for elem in l:
        if elem in container:
            count += 1
    return count

'''
Return a list with n random, unique elements from the [0, 2n) interval
'''
def getRandomList(n):
    randList = []
    for i in range(2*n):
        randList.append(i)
    random.shuffle(randList)
    return randList[:n]

'''
Adds all elements of a list in a dictionary (key = value)
'''
def getDictionaryFromList(l):
    d = {}
    for elem in l:
        d[elem] = elem
    return d


'''
Generate two random list with n elements.
Count how many of the elements from the second list can be found in the first.
In first scenario the elements from the first list are in a list, in the second scenario they are in a dict
Measure and display their run-time.
'''
def time(n):
    firstList = getRandomList(n)
    secondList = getRandomList(n)

    searchInList = firstList[:]
    searchInDict = getDictionaryFromList(firstList)

    #search in list
    startlist = timer()
    countlist = testContainer(searchInList, secondList)
    endlist = timer()

    #search in dict
    startdict = timer()
    countdict = testContainer(searchInDict, secondList)
    enddict = timer() 

    #check if they both return the same solution. This is a must
    assert countlist == countdict
    
    #print runtimes
    print("List:" , "{0:.5f}".format(endlist-startlist))
    print("Dict: ", "{0:.5f}".format(enddict-startdict))
    


