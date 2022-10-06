"""
Find the minimum and maximum of a list.
"""


def list_min(arr):
        minn = arr[0]
        for i in range(len(arr)):
            if arr[i] < minn:
                minn = arr[i]

        return minn

print(list_min([2, 3, 4, 5]))
