from domain.vector_model import MyVector
from typing import List
import matplotlib.pyplot as plt


class VectorRepository:
    """
    Represents a collection of MyVector instances
    """
    def __init__(self, vector_list: List[MyVector] = []):
        """
        This is the initializing method or constructor for the class.
        Creates a new collection with MyVector instances.
        :param vector_list: list of vectors in the collection
        :type vector_list: List[MyVector]
        """
        self.__vectors = []
        for vector in vector_list:
            if self.name_id_exists(vector.get_name_id()):
                raise IndexError(f"A vector named {vector.get_name_id()} is already in the vector repository")
            else:
                self.__vectors.append(vector)

    def __len__(self):
        """
        Overwriting the len() function.
        :return: number of vectors in the repository
        :rtype: int
        """
        return len(self.__vectors)

    def __str__(self):
        """
        Returns the string representation of the repository.
        :return: string representation of an instance
        :rtype: str
        """
        if self.empty_repository():
            raise IndexError("The vector repository is empty. Add some vectors first")

        vectors = "Vectors: \n"
        for vector in self.__vectors:
            vectors += (str(vector))
            vectors += "\n"
        return vectors

    def name_id_exists(self, name_id):
        """
        Checks if a vector's name id exists in the repository.
        :param name_id: name_id value
        :return: True if the given name_id is already in the repository, False otherwise
        :rtype: bool
        """
        for vector in self.__vectors:
            if vector.get_name_id() == name_id:
                return True
        return False

    def empty_repository(self):
        """
        Checks if a repository is empty.
        :return: True if the repository is empty, False otherwise
        :rtype: bool
        """
        if len(self) <= 0:
            return True
        return False

    def add_vector(self, name_id, color, type, values):
        """
        1. Add a vector to the repository.
        :param name_id: unique identifier (id) of a vector
        :type name_id: str
        :param color: color of the vector
        :type color: str (possible values ‘r’, ‘g’, ‘b’, ‘y’ and ‘m’)
        :param type: type of the vector
        :type type: int (greater or equal to 1)
        :param values: list of numbers representing the values of the vector
        :return:
        """
        if self.name_id_exists(name_id):
            raise IndexError(f"A vector named {name_id} is already in the vector repository")

        self.__vectors.append(MyVector(name_id, color, type, values))

    def get_all_vectors(self):
        """
        2. Get all vectors from the repository.
        :return: list of vectors in the repository
        :rtype: List[MyVector]
        """
        if self.empty_repository():
            raise IndexError("The vector repository is empty. Add some vectors first")

        return self.__vectors.copy()

    def get_vector_at_index(self, index):
        """
        3. Get a vector at a given index.
        :param index: the index of the vector we want
        :type index: int
        :return: the vector at index in the repository
        """
        if self.empty_repository():
            raise IndexError("The vector repository is empty. Add some vectors first")
        elif not isinstance(index, int) or 0 < index > len(self):
            raise IndexError(f"The index must be an integer from [0-{len(self)-1}]")

        vector = self.__vectors[index]
        return vector

    def get_vector_of_name_id(self, name_id):
        """
        Get a vector by a given name_id.
        :param name_id: unique identifier (id) of a vector
        :type name_id: str
        :return: the vector of given name_id in the repository
        """
        if self.empty_repository():
            raise ValueError("The vector repository is empty. Add some vectors first")
        elif not self.name_id_exists(name_id):
            raise IndexError(f"No vector named {name_id} in the vector repository")

        for index in range(len(self)):
            if self.__vectors[index].get_name_id() == name_id:
                return self.__vectors[index]

    def update_vector_at_index(self, index, name_id, color, type, values):
        """
        4. Update a vector at a given index.
        :param index: the index of the vector we want
        :type index: int
        :param name_id: unique identifier (id) of a vector
        :type name_id: str
        :param color: color of the vector
        :type color: str (possible values ‘r’, ‘g’, ‘b’, ‘y’ and ‘m’)
        :param type: type of the vector
        :type type: int (greater or equal to 1)
        :param values: list of numbers representing the values of the vector
        :return: the vector at the given index updated in the repository
        """
        if self.empty_repository():
            raise IndexError("The vector repository is empty. Add some vectors first")
        elif not isinstance(index, int) or 0 < index > len(self):
            raise IndexError(f"The index must be an integer from [0-{len(self)-1}]")
        elif self.name_id_exists(name_id):
            raise IndexError(f"Another vector named {name_id} in the vector repository")
        self.__vectors[index].set_name_id(name_id)
        self.__vectors[index].set_color(color)
        self.__vectors[index].set_type(type)
        self.__vectors[index].set_values(values)
        return self.__vectors[index]

    def update_vector_by_name_id(self, name_id, color, type, values):
        """
        5. Update a vector identified by name_id.
        :param name_id: unique identifier (id) of a vector
        :type name_id: str
        :param color: color of the vector
        :type color: str (possible values ‘r’, ‘g’, ‘b’, ‘y’ and ‘m’)
        :param type: type of the vector
        :type type: int (greater or equal to 1)
        :param values: list of numbers representing the values of the vector
        :return: the vector at the given name_id updated in the repository
        """
        if self.empty_repository():
            raise IndexError("The vector repository is empty. Add some vectors first")
        elif not self.name_id_exists(name_id):
            raise IndexError(f"No vector named {name_id} in the vector repository")

        vector = self.get_vector_of_name_id(name_id)
        vector.set_color(color)
        vector.set_type(type)
        vector.set_values(values)
        return vector

    def delete_vector_at_index(self, index):
        """
        6. Delete a vector by index.
        :param index: the index of the vector we want
        :type index: int
        :return:
        """
        if self.empty_repository():
            raise IndexError("The vector repository is empty. Add some vectors first")
        elif not isinstance(index, int):
            raise AttributeError(f"The index must be an integer")
        elif 0 < index > len(self):
            raise IndexError(f"The index must be an integer from [0-{len(self) - 1}]")

        del self.__vectors[index]

    def delete_vector_by_name_id(self, name_id):
        """
        7. Delete a vector by name_id.
        :param name_id: unique identifier (id) of a vector
        :type name_id: str
        :return:
        """
        if self.empty_repository():
            raise IndexError("The vector repository is empty. Add some vectors first")
        elif not self.name_id_exists(name_id):
            raise IndexError(f"No vector named {name_id} in the vector repository")

        updated_vector = []
        for vector in self.__vectors:
            if vector.get_name_id() != name_id:
                updated_vector.append(MyVector(
                    vector.get_name_id(),
                    vector.get_color(),
                    vector.get_type(),
                    vector.get_values()
                ))
        self.__vectors = updated_vector.copy()

    def plot_vectors_in_chart(self):
        """
        8. Plot all vectors in a chart based on the type and color of each vector (using library matplotlib).
        Type should be interpreted as follows: 1 – circle, 2 – square, 3 – triangle, any other value – diamond.
        :return:
        """
        if self.empty_repository():
            raise IndexError("The vector repository is empty. Add some vectors first")

        plt.title('The Vector Repository')
        plt.grid()
        for vector in self.__vectors:
            if vector.get_type() == 1:
                plt.scatter(range(len(vector.get_values())), vector.get_values(), marker="o",
                            color=f"{vector.get_color()}")
            elif vector.get_type() == 2:
                plt.scatter(range(len(vector.get_values())), vector.get_values(), marker="s",
                            color=f"{vector.get_color()}")

            elif vector.get_type() == 3:
                plt.scatter(range(len(vector.get_values())), vector.get_values(), marker="^",
                            color=f"{vector.get_color()}")
            else:
                plt.scatter(range(len(vector.get_values())), vector.get_values(), marker="D",
                            color=f"{vector.get_color()}")
        plt.show()

    def get_vectors_of_given_sum(self, summ):
        """
        11. Get the list of vectors having a given sum of elements.
        :param summ: a given sum
        :type summ: float
        :return: a new collection with MyVector instances that have the given sum of elements
        """
        if self.empty_repository():
            raise IndexError("The vector repository is empty! Add some vectors first")
        if not isinstance(summ, int):
            if not isinstance(summ, float):
                raise AttributeError("The given sum must be a real number")

        vectors_of_sum = VectorRepository()
        for vector in self.__vectors:
            if vector.sum_of_elements() == summ:
                vectors_of_sum.add_vector(
                    vector.get_name_id(),
                    vector.get_color(),
                    vector.get_type(),
                    vector.get_values()
                )

        if len(vectors_of_sum) == 0:
            raise IndexError("Not one vector in the repository has the given sum of elements")

        return vectors_of_sum

    def delete_vectors_between_indexes(self, index1, index2):
        """
        19. Delete all vectors that are between two given indexes.
        :param index1: integer representing an index
        :type index1: int
        :param index2: integer representing an index
        :type index2: int
        :return:
        """
        if self.empty_repository():
            raise IndexError("The vector repository is empty! Add some vectors first")
        elif not isinstance(index1, int) or not isinstance(index2, int):
            raise AttributeError(f"The indexes must be integers")
        elif 0 < index1 > len(self) or 0 < index2 > len(self):
            raise IndexError(f"The indexes must be integers from [0-{len(self) - 1}]")

        elif index1 == index2:
            self.delete_vector_at_index(index1)
            return self.__vectors.copy()
        elif index1 > index2:
            for i in range(index1, index2, -1):
                self.delete_vector_at_index(i)
            self.delete_vector_at_index(index2)
            return self.__vectors.copy()
        elif index1 < index2:
            for i in range(index2, index1, -1):
                self.delete_vector_at_index(i)
            self.delete_vector_at_index(index1)
            return self.__vectors.copy()

    def update_vector_color_by_name_id(self, name_id, color):
        """
        22. Update the color of a vector identified by name_id.
        :param name_id: unique identifier (id) of a vector
        :type name_id: str
        :param color: color of the vector
        :type color: str (possible values ‘r’, ‘g’, ‘b’, ‘y’ and ‘m’)
        :return: the vector at the given name_id with its color updated in the repository
        """
        if self.empty_repository():
            raise IndexError("The vector repository is empty! Add some vectors first")
        elif not self.name_id_exists(name_id):
            raise IndexError(f"No vector named {name_id} in the vector repository")
        else:
            for index in range(len(self)):
                if self.__vectors[index].get_name_id() == name_id:
                    self.__vectors[index].set_color(color)
                    return self.__vectors[index]
