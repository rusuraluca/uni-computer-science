"""
This is the module for the tests.
"""
# import all the functions into the local symbol table
from domain.controler_participants_list import *
from domain.file_controler_participants_list import *
from utils.statistics import *


def test_add():
    """
    Test function add
    :return:
    """
    print("Test function add")
    participants = []
    print("Test 1")
    add(participants, ['0', 80])
    assert len(participants) == 1
    assert participants == [['0', 80]]
    print("Test 2")
    try:
        add(participants, ['1', 0])
        assert False
    except ValueError:
        assert True

    print("Test 3")
    try:
        add(participants, ['1', 1000])
        assert False
    except ValueError:
        assert True


def test_insert():
    """
    Test function insert
    :return:
    """
    print("Test function insert")
    participants = []
    print("Test 1")
    insert(participants, 0, ['0', 70])
    assert len(participants) == 1
    assert participants == [['0', 70]]
    print("Test 2")
    insert(participants, 1, ['1', 0])
    assert len(participants) == 1
    assert participants == [['0', 70]]
    print("Test 3")
    insert(participants, 2, ['1', 1000])
    assert len(participants) == 1
    assert participants == [['0', 70]]


def test_remove():
    """
    Test function remove
    :return:
    """
    print("Test function remove")
    participants = [['0', 70], ['1', 50], ['2', 35], ['3', 90]]
    print("Test 1")
    remove(participants, 3)
    assert len(participants) == 3
    assert participants == [['0', 70], ['1', 50], ['2', 35]]
    print("Test 2")
    remove(participants, 1)
    assert len(participants) == 2
    assert participants == [['0', 70], ['2', 35]]
    print("Test 3")
    remove(participants, 7)
    assert len(participants) == 2
    assert participants == [['0', 70], ['2', 35]]


def test_remove2():
    """
    Test function remove2
    :return:
    """
    print("Test function remove 2")
    participants = [['0', 70], ['1', 50], ['2', 35], ['3', 90]]
    print("Test 1")
    remove2(participants, 0, 1)
    assert len(participants) == 2
    assert participants == [['2', 35], ['3', 90]]
    print("Test 2")
    remove2(participants, 4, 7)
    assert len(participants) == 2
    assert participants == [['2', 35], ['3', 90]]
    print("Test 3")
    remove2(participants, 0, 0)
    assert len(participants) == 1
    assert participants == [['3', 90]]


def test_replace():
    """
    Test function replace
    :return:
    """
    print("Test function replace")
    participants = [['0', 70], ['1', 50], ['2', 35], ['3', 90]]
    print("Test 1")
    replace(participants, 0, [89])
    assert participants == [['0', 89], ['1', 50], ['2', 35], ['3', 90]]
    print("Test 2")
    replace(participants, 4, [90])
    assert participants == [['0', 89], ['1', 50], ['2', 35], ['3', 90]]
    print("Test 3")
    replace(participants, 3, [900])
    assert participants == [['0', 89], ['1', 50], ['2', 35], ['3', 90]]


def test_less():
    """
    Test function less
    :return:
    """
    print("Test function less")
    participants = [['0', 70], ['1', 50], ['2', 35], ['3', 90]]
    print("Test 1")
    assert less(participants, 40) == [['2', 35]]
    print("Test 2")
    assert less(participants, 90) == [['0', 70], ['1', 50], ['2', 35]]
    print("Test 3")
    try:
        less(participants, 10)
        assert False
    except ValueError:
        assert True


def test_sorted():
    """
    Test function sorted
    :return:
    """
    print("Test function sorted")
    participants = [['0', 70], ['1', 50], ['2', 35], ['3', 90]]
    print("Test 1")
    assert sorted(participants) == [['2', 35], ['1', 50], ['0', 70], ['3', 90]]
    print("Test 2")
    participants = [['0', 30], ['1', 25], ['2', 35], ['3', 80]]
    assert sorted(participants) == [['1', 25], ['0', 30], ['2', 35], ['3', 80]]
    print("Test 3")
    participants = [['0', 10], ['1', 25], ['2', 65], ['3', 55]]
    assert sorted(participants) == [['0', 10], ['1', 25], ['3', 55], ['2', 65]]


def test_more_sorted():
    """
    Test function more_sorted
    :return:
    """
    print("Test function more_sorted")
    participants = [['0', 70], ['1', 50], ['2', 35], ['3', 90]]
    print("Test 1")
    assert more_sorted(participants, 10) == [['2', 35], ['1', 50], ['0', 70], ['3', 90]]
    print("Test 2")
    try:
        more_sorted(participants, 100)
        assert False
    except ValueError:
        assert True
    print("Test 3")
    participants = [['0', 10], ['1', 25], ['2', 65], ['3', 55]]
    assert more_sorted(participants, 50) == [['3', 55], ['2', 65]]


def test_avg():
    """
    Test function avg
    :return:
    """
    print("Test function avg")
    participants = [['0', 70], ['1', 50], ['2', 30], ['3', 90]]
    print("Test 1")
    assert avg(participants, 0, 1) == 60
    print("Test 2")
    try:
        avg(participants, 5, 8)
        assert False
    except ValueError:
        assert True
    print("Test 3")
    assert avg(participants, 2, 3) == 60


def test_min():
    """
    Test function min
    :return:
    """
    print("Test function min")
    participants = [['0', 70], ['1', 50], ['2', 30], ['3', 90]]
    print("Test 1")
    assert min(participants, 0, 1) == 50
    print("Test 2")
    assert min(participants, 0, 3) == 30
    print("Test 3")
    assert min(participants, 2, 3) == 30


def test_mul():
    """
    Test function mul
    :return:
    """
    print("Test function mul")
    participants = [['0', 72], ['1', 50], ['2', 30], ['3', 90]]
    print("Test 1")
    assert mul(participants, 10, 0, 1) == [['1', 50]]
    print("Test 2")
    assert mul(participants, 5, 0, 3) == [['1', 50], ['2', 30], ['3', 90]]
    print("Test 3")
    assert mul(participants, 3, 2, 3) == [['2', 30], ['3', 90]]


def test_filter_mul():
    """
    Test function filter mul
    :return:
    """
    print("Test function filter_mul")
    participants = [['0', 72], ['1', 50], ['2', 30], ['3', 90]]
    print("Test 1")
    assert filter_mul(participants, 10) == [['1', 50], ['2', 30], ['3', 90]]
    print("Test 2")
    assert filter_mul(participants, 3) == [['2', 30], ['3', 90]]
    print("Test 3")
    assert filter_mul(participants, 7) == []


def test_filter_greater():
    """
    Test function filter greater
    :return:
    """
    print("Test function filter_greater")
    participants = [['0', 72], ['1', 50], ['2', 30], ['3', 90]]
    print("Test 1")
    assert filter_greater(participants, 10) == [['0', 72], ['1', 50], ['2', 30], ['3', 90]]
    print("Test 2")
    assert filter_greater(participants, 60) == [['0', 72], ['3', 90]]
    print("Test 3")
    assert filter_greater(participants, 100) == []


def test_undo():
    """
    Test function test_undo
    :return:
    """

def test_read_from_file():
    """
    Test function test_read_from_file
    :return:
    """
    print("Test function test_read_from_file")
    participants = []
    print("Test 1")
    read_from_file(participants)
    assert participants == [['0', 80], ['1', 80], ['2', 100], ['3', 40], ['4', 50], ['5', 50],
                            ['6', 76], ['7', 25], ['8', 10], ['9', 30], ['10', 69]]


def all_tests():
    """
    Run all tests.
    :return:
    """
    test_add()
    test_insert()
    test_remove()
    test_remove2()
    test_replace()
    test_less()
    test_sorted()
    test_more_sorted()
    test_avg()
    test_min()
    test_mul()
    test_filter_mul()
    test_filter_greater()
    test_undo()
    test_read_from_file()