"""
This is the module for the user interface.
"""
from copy import deepcopy

import domain.controler_participants_list as part_list
import domain.file_controler_participants_list as file_part_list

import utils.statistics as stats_list


def print_menu():
    """
    Print the menu options available in the interface.
    :return:
    """
    print("Welcome evaluation committee! Here is the menu of the program for the competition:")
    print("0 - Exit Program")
    print("1 - Add the result of a new participant")
    print("2 - Insert another result for an existing participant")
    print("3 - Remove an existing participant")
    print("4 - Remove more than one existing participants between two given places")
    print("5 - Change the score of an existing participant")
    print("6 - Get the participants with scores less than a given score")
    print("7 - Get the participants with scores higher than a given score sorted")
    print("8 - Get all the participants sorted by their score")
    print("9 - Get the average score for participants between two given places")
    print("10 - Get the minimum score for participants between two given places")
    print("11 - Get the score of participants multiples of a given value between two given places")
    print("12 - Keep only participants with scores multiple of value, removing the other participants scores")
    print("13 - Keep only participants with scores higher than value, removing the other participants scores")
    print("14 - Undo the last operation")
    print("15 - Print the list of scores")
    print("16 - Read current list from file")
    print("17 - Write the current list to file.")


def start():
    """
    Start the menu type console.
    :return:
    """
    print_menu()
    print("Choose a command you want to access:")
    command = input(">>> ")

    # stored the participants in a list where:
    # at index i, the id (i) and the score of the participant is stored
    # 10 data examples
    participants_list = [['0', 80], ['1', 80], ['2', 100], ['3', 40], ['4', 50], ['5', 50],
                         ['6', 76], ['7', 25], ['8', 10], ['9', 30], ['10', 69]]
    undo_states = []
    undo_states.append(deepcopy(participants_list))

    while command != "0":
        try:
            if command == "1":
                # Add the result of a new participant

                # a list to store the new participant
                new_entry = []

                # we add it as the last element of the score list = its id
                new_entry.append(str(len(participants_list)))
                # we also add its score
                new_entry.append(int(input("Score: ")))

                print(part_list.add(participants_list, new_entry))

                # for undo
                undo_states.append(deepcopy(participants_list))

            elif command == "2":
                # Insert a participant at a given index

                # a list to store the new participant
                new_entry = []

                # a variable to store the index/id of the participant we want to add
                read_index = int(input("Participant index: "))
                # we add the id
                new_entry.append(str(len(participants_list)))
                new_entry.append(int(input("Score: ")))

                print(part_list.insert(participants_list, read_index, new_entry))

                # for undo
                undo_states.append(deepcopy(participants_list))

            elif command == "3":
                # Remove an existing participant
                read_index = int(input("Participant index: "))

                print(part_list.remove(participants_list, read_index))

                # for undo
                undo_states.append(deepcopy(participants_list))

            elif command == "4":
                # Remove more than one existing participants between two given places
                read_index = int(input("First participant index: "))
                read_index2 = int(input("Last participant index: "))

                print(part_list.remove2(participants_list, read_index, read_index2))

                # for undo
                undo_states.append(deepcopy(participants_list))

            elif command == "5":
                # Change the score of an existing participant
                new_entry = []
                read_index = int(input("Participant index: "))
                new_entry.append(int(input("New score: ")))

                print(part_list.replace(participants_list, read_index, new_entry))

                # for undo
                undo_states.append(deepcopy(participants_list))

            elif command == "6":
                # Get the participants with scores less than a given score
                read_value = int(input("Give a score: "))
                new_list = stats_list.less(participants_list, read_value)
                if len(new_list) == 0:
                    print("There are no students with scores less than a given score")
                else:
                    part_list.print_participants(new_list)

            elif command == "7":
                # Get the participants with scores higher than a given score, sorted
                read_value = int(input("Give a score: "))
                new_list = stats_list.more_sorted(participants_list, read_value)

                if len(new_list) == 0:
                    print("There are no students with scores higher than a given score")
                else:
                    part_list.print_participants(new_list)

            elif command == "8":
                # Get all the participants sorted by their score
                part_list.print_participants(stats_list.sorted(participants_list))

            elif command == "9":
                # Get the average score for participants between two given places
                read_index = int(input("First participant index: "))
                read_index2 = int(input("Last participant index: "))
                print(stats_list.avg(participants_list, read_index, read_index2))

            elif command == "10":
                # Get the minimum score for participants between two given places
                read_index = int(input("First participant index: "))
                read_index2 = int(input("Last participant index: "))
                print(stats_list.min(participants_list, read_index, read_index2))

            elif command == "11":
                # Get the score of participants between the two given places, which are multiples of a given value
                read_index = int(input("First participant index: "))
                read_index2 = int(input("Last participant index: "))
                read_value = int(input("Give a value: "))
                new_list = stats_list.mul(participants_list, read_value, read_index, read_index2)
                if len(new_list) == 0:
                    print("There are no students with scores which are multiples of a given value")
                else:
                    part_list.print_participants(new_list)

            elif command == "12":
                # Keep only participants with scores multiple of value, removing the other participants scores

                read_value = int(input("Give a value: "))
                part_list.print_participants(part_list.filter_mul(participants_list, read_value))

                # for undo
                undo_states.append(deepcopy(participants_list))

            elif command == "13":
                # Keep only participants with scores higher than value, removing the other participants scores

                read_value = int(input("Give a value: "))
                part_list.print_participants(part_list.filter_greater(participants_list, read_value))

                # for undo
                undo_states.append(deepcopy(participants_list))

            elif command == "14":
                # Undo the last operation

                if len(undo_states) == 0:
                    print("No more possible undos")
                else:
                    undo_states.pop()
                    if len(undo_states) == 0:
                        participants_list = []
                    else:
                        participants_list = deepcopy(undo_states[-1])

                    part_list.print_participants(participants_list)

            elif command == "15":
                # Print the list of scores
                part_list.print_participants(participants_list)

            elif command == "16":
                participants_list = []

                file_part_list.read_from_file(participants_list)

                part_list.print_participants(participants_list)

                # for undo
                undo_states.append(deepcopy(participants_list))

            elif command == "17":

                file_part_list.write_in_file(participants_list)

                part_list.print_participants(participants_list)

                # for undo
                undo_states.append(deepcopy(participants_list))

            else:
                print("Invalid command")

            command = input(">>> ")

        except ValueError as ve:
            print(ve)
