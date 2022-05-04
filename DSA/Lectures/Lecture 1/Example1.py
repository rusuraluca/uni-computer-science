from random import *
from timeit import default_timer as timer


'''
First algorithms
'''
def first(l):    
    maxSum = 0
    for i in range(len(l)):
        for j in range(i, len(l)):
            currentSum = 0
            for k in range(i, j+1):
                currentSum += l[k]
            if currentSum > maxSum:
                maxSum = currentSum                
    return maxSum

'''
Second algorithm
'''
def second(l):
    maxSum = 0
    
    for i in range(len(l)):
        currentSum = 0;
        for j in range(i, len(l)):
            currentSum += l[j]
            if currentSum > maxSum:
                maxSum = currentSum
                
    return maxSum

'''
Third algorithm
'''
def recursive(list, left, right):
    
    if left == right:
        return list[left]
    else:
        middle = (left + right) // 2
        leftPart = recursive(list, left, middle)
        rightPart = recursive(list, middle+1, right)
        mPart = middlePart(list, left, right, middle)
        
        if leftPart > rightPart and leftPart > mPart:
            return leftPart
        if rightPart > leftPart and rightPart > mPart:
            return rightPart
        return mPart
    
    
def middlePart(list, left, right, middle):
    toLeft = 0;
    maxLeft = 0;
    for i in range(middle-1, left-1, -1):
        toLeft += list[i]
        if toLeft > maxLeft:
            maxLeft = toLeft
    toRight = 0
    maxRight = 0
    for i in range(middle, right+1):
        toRight += list[i]
        if toRight > maxRight:
            maxRight = toRight
    
    return (maxLeft + maxRight)

def third(list):
    return recursive(list, 0, len(list)-1)

'''
Fourth algorithm
'''
def fourth(list):
    
    maxSum = 0    
    currentSum = 0
    
    for i in range(len(list)):
        currentSum += list[i]
        if currentSum > maxSum:
            maxSum = currentSum
        if currentSum < 0:
            currentSum = 0
    return maxSum


'''
Return a list with n random elements from the -500, 500 interval
'''
def getRandomList(n):
    randList = []
    for i in range(n):
        randList.append(randint(-500, 500))
    return randList


'''
Generate a random list with n elements.
Run all four algorithms and measure and display their run-time.
'''
def time(n):
    randList = getRandomList(n)
    # make 4 copies of the list. In theory algorithms don't change the param, but just to be safe
    listcopy1 = randList[:]
    listcopy2 = randList[:]
    listcopy3 = randList[:]
    listcopy4 = randList[:]

    #run first algorithm
    startfirst = timer()
    solfirst = first(listcopy1)
    endfirst = timer()

    #run second algorithm
    startsecond = timer()
    solsecond = second(listcopy2)
    endsecond = timer()

    #run third algorithm
    startthird = timer()
    solthird = third(listcopy3)
    endthird = timer() 

    #run the fourth algorithm
    startfourth = timer()
    solfourth = fourth(listcopy4)
    endfourth = timer()

    #check if they all return the same solution. This is a must
    assert solfirst == solsecond
    assert solfirst == solthird
    assert solfirst == solfourth
    
    #print runtimes
    print("First:" , "{0:.5f}".format(endfirst-startfirst))
    print("Second: ", "{0:.5f}".format(endsecond-startsecond))
    print("Third: ", "{0:.5f}".format(endthird-startthird))
    print("Fourth: ", "{0:.5f}".format(endfourth - startfourth))



