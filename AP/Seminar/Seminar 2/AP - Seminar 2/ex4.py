def list_max(l):

    """
    function to find the maximum of a given list
    :param l: list
    :return: maximum element
    """
    if len(l) > 0:
        maxx = l[0]
        for i in range(len(l)):
            if l[i] > maxx:
                maxx = l[i]

        return maxx
    else:
        return None


def list_min(l):
    """
    function to find the minimum of a given list
    :param l: list
    :return: minimum element
    """
    if len(l) > 0:
        minn = l[0]
        for i in range(len(l)):
            if l[i] < minn:
                minn = l[i]

        return minn
    else:
        return None


print(list_max([2,3,4,5,6,7]))
print(list_min([2,3,4,5,6,7]))

print(list_min([]))
print(list_max([]))

