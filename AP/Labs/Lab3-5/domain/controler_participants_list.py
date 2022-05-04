"""
This module provides useful computations on the list of scores of participants.
"""


def print_participants(score_list: list):
    """
    Prints the elements of the list in a visual way.
    :param score_list: list of participants scores
    :return:
    """
    for participant in score_list:
        print(f"Id: {participant[0]}, Score: {participant[1]}")


def add(score_list: list, value: list):
    """
    Adds value as last element of score_list.
    :param score_list: list of participants scores
    :param value: list of a new participant with its score
    :return:
    """
    if 0 < value[1] <= 100:
        score_list.append(value)
        return "Participant added"

    raise ValueError("Invalid input of the score.")


def insert(score_list: list, index: int, value: list):
    """
    Inserts number value at index.
    :param score_list: list of participants scores
    :param index: a variable representing the index of the participant
    :param value: list of a participant with its score
    :return:
    """
    # in case it's not already in the score list
    if 0 < value[1] <= 100:
        score_list.insert(index+1, value)
        return f"Participant {len(score_list)-1} with score {value[1]} was added."
    else:
        return "Invalid input of the score."


def remove(score_list, index):
    """
    Removes participant at given index.
    :param score_list: list of participants scores
    :param index: variable representing the index of the participant we want to remove
    :return:
    """
    if index < len(score_list):
        score_list.remove(score_list[index])
        return f"Participant was deleted."

    return "Invalid input of the index"


def remove2(score_list, from_index, to_index):
    """
    Removes participants between the two given index.
    :param score_list: list of participants scores
    :param from_index: variable representing the index of the first participant we want to remove
    :param to_index: variable representing the index of the last participant we want to remove
    :return:
    """
    if from_index < len(score_list):
        if to_index < len(score_list):
            del score_list[from_index:to_index+1]
            return f"Participants {from_index} to {to_index} were deleted."
        else:
            return "Invalid input of the second index"

    return "Invalid input of the first index"


def replace(score_list: list, index, new_value: list):
    """
    Replaces the score of the participant at index with the new_value.
    :param score_list: list of participants scores
    :param index: variable representing the index of the participant we want to update
    :param new_value: list of the participant with its new score
    :return:
    """
    if index < len(score_list):
        if 0 < new_value[0] <= 100:
            score_list[index][1] = new_value[0]
            return f"Participant {score_list[index][0]} with score {score_list[index][1]} was updated."
        else:

            return "Invalid input of the score"
    return "Invalid input of the index"


def filter_mul(score_list, value):
    """
    Keep only participants with scores multiple of value, removing the other participants scores
    :param score_list: list of participants scores
    :param value: variable representing the value of which we check for its multiple scores
    :return:
    """
    i = 0
    while i < len(score_list):
        if score_list[i][1] % value != 0:
            score_list.remove(score_list[i])
            i = i-1
        i = i+1

    return score_list


def filter_greater(score_list, value):
    """
    Keep only participants with scores higher than value, removing the other participants scores
    :param score_list: list of participants scores
    :param value: variable representing the value to which we check for higher scores
    :return:
    """
    i = 0
    while i < len(score_list):
        if score_list[i][1] <= value:
            score_list.remove(score_list[i])
            i = i - 1
        i = i + 1

    return score_list


def undo():
    """

    :return:
    """