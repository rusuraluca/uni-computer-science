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


def search(mylist, condition):
    """
    Searches elements in a list that respect a given condition and appends them in a list.
    :param mylist: a list
    :param condition: a function
    :return: a list
    """
    result = []
    for elem in mylist:
        if condition(elem):
            result.append(elem)
    return result


def get_next(index):
    return index+1


def init_solution(domain):
    return domain[0]


def is_consistent(sol, mylist, constraints):
    for c in constraints:
        if not c(sol, mylist):
            return False
    return True


def get_last(domain):
    return domain[len(domain) - 1]


def is_solution(sol, param):
    return len(sol) == param[0]


def backtracking(param, mylist, constraints):
    """
    Forms groups of elements from the list.
    :param param: a list
    :param mylist: a list
    :param constraints: a list with functions
    :return: one or more lists with indices
    """
    domain = [i for i in range(-1, len(mylist))]
    k = 0
    sol = []
    sol.append(init_solution(domain))
    while k >= 0:
        is_selected = False
        while not is_selected and sol[k] < get_last(domain):
            sol[k] = get_next(sol[k])
            is_selected = is_consistent(sol, mylist, constraints)

        if is_selected:
            if is_solution(sol, param):
                yield sol
            else:
                k = k + 1
                sol.append(init_solution(domain))
        else:
            sol.pop()
            k = k - 1
