"""
Problem 2:
a. Substitute the i-th element from a list, with a value v. [assumed indexing from 1]
b. Determine difference of two sets represented as lists.

Mathematical model:
a.
subst([l1...ln], i, v) = { []                           , if l is empty
                         { v U subst([l2..ln], i, v),   , if i == 1
                         { l1 U subst([l2..ln], i-1, v) , otherwise

b.
diff([l1...ln], [p1...pm]) = { []                               , if l is empty
                             { diff([l2...ln], [p1...pm])       , if l1 in [p1...pm]
                             { l1 U diff([l2...ln], [p1...pm])  , otherwise
"""


class Node:
    def __init__(self, key):
        self.key = key
        self.next = None


class SLL:
    def __init__(self):
        self.head = None
        self.elems = 0

    # function to append an element at the end of the SLL
    def add(self, key):
        node = Node(key)

        if self.head is None:
            self.head = node
            return

        last = self.head
        while last.next:
            last = last.next
        last.next = node


def create():
    list = SLL()
    list.head = create_rec()
    return list


def create_rec():
    x = int(input("x="))
    if x == 0:
        return None
    else:
        nod = Node(x)
        nod.next = create_rec()
        return nod


def show(list):
    show_rec(list.head)


def show_rec(node):
    if node is not None:
        print(node.key, end=" ")
        show_rec(node.next)


class Solution:
    def a(self, head, i, v):
        # base case
        if head is None:
            return []

        # required case (or favorable idk)
        elif i == 1:
            head.key = v
            return head

        # recursive call
        else:
            i -= 1
            return self.a(head.next, i, v)

    def b(self, head1, head2, head3):
        # additional recursive function to check if an element in the first SLL is in the second SLL
        def exists(key, head):
            if head is None:
                return False
            if head.key == key:
                return True
            return exists(key, head.next)

        # base case
        if head1 is None:
            return

        # copy of the second SLL in order to check for every element in the first SLL if it is in the second SLL
        # without a copy for each element I could only traverse once the second SLL, since it only has a next pointer
        head = head2
        # favorable case
        # if it is not in the second SLL, we add it to our third SLL where we keep the required difference
        if not exists(head1.key, head):
            head3.add(head1.key)

        # recursive call
        self.b(head1.next, head2, head3)


class Tests:
    def test_a(self):
        print('a. Substitute the i-th element from a list, with a value v.')
        s = Solution()
        print('\nFor the purpose of the test i = 2 and v = 10.')
        print('\nEnter an array with at least 2 elements, end adding elements by typing 0:')
        l = create()
        i = 2
        v = 10
        print('\nBefore substitution:')
        show(l)
        s.a(l.head, i, v)
        print('\nAfter substitution:')
        show(l)

    def test_b(self):
        print('b. Determine difference of two sets represented as lists')
        s = Solution()
        print('Enter the array from which we subtract, end adding elements by typing 0:')
        l = create()
        print('Enter the array that we subtract, end adding elements by typing 0:')
        k = create()
        res = SLL()
        s.b(l.head, k.head, res)
        print('Their difference is:')
        if res.head is None:
            print('The empty set.')
        show(res)


# Testing
t = Tests()
t.test_a()
print("\n\n ------------ Test a Passed! ------------ \n\n")
t.test_b()
print("\n\n ------------ Test b Passed! ------------ ")
