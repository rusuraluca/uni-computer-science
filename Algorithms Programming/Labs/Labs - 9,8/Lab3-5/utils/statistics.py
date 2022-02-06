"""
This module provides useful statistic computations on the list of scores of participants.
"""


def less(score_list, value):
    """
    Gets participants with score less than value.
    :param score_list: a list where all the scores of all the participants are stored
    :param value: an integer that represents the value to which we compare the scores of participants
    :return less_list: a list with the participants with score less than value
    """

    less_list = []

    for participant in score_list:
        if participant[1] < value:
            less_list.append(participant)

    if len(less_list) > 0:
        return less_list

    raise ValueError("No participants with score less than value")


def sorted(score_list):
    """
    Gets all participants sorted by their score.
    :param score_list: the list where all the scores of all the participants are stored
    :return : a new list with all the scores of all the participants sorted
    """

    sorted_score_list = score_list.copy()

    # used an in-place sort because we sort by scores
    sorted_score_list.sort(key=lambda x: x[1])

    return sorted_score_list


def more_sorted(score_list, value):
    """
    Gets the participants with scores higher than value, sorted.
    :param score_list: the list where all the scores of all the participants are stored
    :param value: a variable that represents the value to which we compare the scores
    :return: a list of participants with scores higher than value, sorted
    """

    high_list = []

    for participant in score_list:
        if participant[1] > value:
            high_list.append(participant)

    # used an in-place sort because we sort by scores
    high_list.sort(key=lambda x: x[1])

    if len(high_list) > 0:
        return high_list

    raise ValueError("No participants with scores higher than value")


def avg(score_list, from_index, to_index):
    """
    Gets the average score for participants between the two given index.
    :param score_list: the list where all the scores of all the participants are stored
    :param from_index: a variable representing the index of the participant we want to start with
    :param to_index: a variable representing the index of the participant we want to end with
    :return: a variable representing the average score
    """

    average_list = []
    sum = 0

    for participant in score_list[from_index:to_index+1]:
        average_list.append(participant[1])
        sum += int(participant[1])

    if len(average_list) > 0:
        average_score = sum / len(average_list)
        return round(average_score, 2)

    raise ValueError("Couldn't compute the average")


def min(my_list, from_index, to_index):
    """
    Gets the minimum score for participants between the two given index.
    :param my_list: the list where all the scores of all the participants are stored
    :param from_index: a variable representing the index of the participant we want to start with
    :param to_index: a variable representing the index of the participant we want to end with
    :return: a variable representing the minimum score
    """

    minn = 101

    for participant in my_list[from_index:to_index + 1]:
        if participant[1] < minn:
            minn = participant[1]

    if minn < 101:
        return minn

    raise ValueError("Given indexes are incorrect.")


def mul(score_list, value, from_index, to_index):
    """
    Gets the score of participants between the two given index, which are multiples of value.
    :param score_list: the list where all the scores of all the participants are stored
    :param value: a variable representing the value of which we check the multiples
    :param from_index: a variable representing the index of the participant we want to start with
    :param to_index: a variable representing the index of the participant we want to end with
    :return: a list of participants with scores multiples of value
    """

    multiples_list = []

    for participant in score_list[from_index:to_index + 1]:
        if participant[1] % value == 0:
            multiples_list.append(participant)

    if len(multiples_list) > 0:
        return multiples_list

    raise ValueError("No participants between the two given indexes, which are multiples of value.")

