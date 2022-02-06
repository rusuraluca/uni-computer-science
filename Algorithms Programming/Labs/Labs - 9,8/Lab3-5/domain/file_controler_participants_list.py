"""
This module performs file operations on the list of scores of participants.
"""

def read_from_file(score_list):
    try:
        fin = open("input.txt", "r")

        all_lines = fin.read()  # read all the lines

        lines = all_lines.split("\n")

        for line in lines:  # consider each line from the file
            words = line.split(" ") # split the line in words
            for w in words: # for every word
                # list to store a participant's elements - id and score
                new_entry = []
                # first we add their id
                new_entry.append(str(len(score_list)))
                # then we add the word as an int since it's a score
                new_entry.append(int(w))
                # add the participant to the score list
                score_list.append(new_entry)

        fin.close()

    except IOError as ex:
        print("Reading File errors: ", ex)


def write_in_file(score_list):
    try:
        fout = open("output.txt", "w")

        # write the list in the output file
        for participant in score_list:
            fout.write(f"Id: {participant[0]}, Score: {participant[1]} \n")

        fout.close()

    except IOError as e1:
        print("Something is wrong as IO..." + str(e1))

    except ValueError as e2:
        print("Something is wrong as value..." + str(e2))

