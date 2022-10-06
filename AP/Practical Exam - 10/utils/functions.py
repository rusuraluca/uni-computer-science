def sort(mylist, relation):
    """
    Sorts the elements from a list by a given relation.
    :param mylist: a list
    :param relation: a function
    :return: a list
    """
    for i in range(0, len(mylist)-1):
        for j in range(i+1, len(mylist)):
            if relation(mylist[i], mylist[j]):
                mylist[i], mylist[j] = mylist[j], mylist[i]
    return mylist
