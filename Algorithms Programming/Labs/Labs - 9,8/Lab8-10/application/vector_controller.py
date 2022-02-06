from infrastructure.vector_repository import VectorRepository


class VectorController:
    """
    Controller class to reach the logical/domain layer.
    """
    def __init__(self, vector_repository: VectorRepository = VectorRepository()):
        """
        Init a controller instance
        :param vector_repository:
        :type vector_repository: VectorRepository()
        """
        self.__vector_repository = vector_repository

    def __str__(self):
        """
        Convert the object into string.
        :return: string representation of the controller
        :rtype: str
        """
        return str(self.__vector_repository)

    def __len__(self):
        """
        Overwriting the len() function.
        :return: number of vectors in the repository
        :rtype: int
        """
        return len(self.__vector_repository)

    def add_vector(self, name_id, color, type, values):
        """
        1. Add a vector to the repository.
        :param name_id: unique identifier (id) of a vector
        :type name_id: str
        :param color: color of the vector
        :type color: str (possible values ‘r’, ‘g’, ‘b’, ‘y’ and ‘m’)
        :param type: type of the vector
        :type type: int (greater or equal to 1)
        :param values: values of a vector
        :type values: List[float]
        :return:
        """
        return self.__vector_repository.add_vector(name_id, color, type, values)

    def get_all_vectors(self):
        """
        2. Get all vectors from the repository.
        Similarly to when we return the list of values, here also we should
        return a copy from the list, otherwise the user will be able
        to modify it.
        :return: list of vectors in the repository
        :rtype: List[MyVector]
        """
        return self.__vector_repository.get_all_vectors()

    def get_vector_at_index(self, index):
        """
        3. Get a vector at a given index.
        :param index: the index of the vector we want
        :type index: int
        :return: the vector at the given index in the repository
        """
        return self.__vector_repository.get_vector_at_index(index)

    def get_vector_of_name_id(self, name_id):
        """
        Get a vector by a given name_id.
        :param name_id: unique identifier (id) of a vector
        :type name_id: str
        :return: the vector of the given name_id in the repository
        """
        return self.__vector_repository.get_vector_of_name_id(name_id)

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
        :param values: values of a vector
        :type values: List[float]
        :return: the vector at the given index updated in the repository
        """
        return self.__vector_repository.update_vector_at_index(index, name_id, color, type, values)

    def update_vector_by_name_id(self, name_id, color, type, values):
        """
        5. Update a vector identified by name_id.
        :param name_id: unique identifier (id) of a vector
        :type name_id: str
        :param color: color of the vector
        :type color: str (possible values ‘r’, ‘g’, ‘b’, ‘y’ and ‘m’)
        :param type: type of the vector
        :type type: int (greater or equal to 1)
        :param values: values of a vector
        :type values: List[float]
        :return: the vector at the given index updated in the repository
        """
        return self.__vector_repository.update_vector_by_name_id(name_id, color, type, values)

    def delete_vector_at_index(self, index):
        """
        6. Delete a vector by index.
        :param index: the index of the vector we want
        :type index: int
        """
        return self.__vector_repository.delete_vector_at_index(index)

    def delete_vector_by_name_id(self, name_id):
        """
        7. Delete a vector by name_id.
        :param name_id: unique identifier (id) of a vector
        :type name_id: str
        """
        return self.__vector_repository.delete_vector_by_name_id(name_id)

    def plot_vectors_in_chart(self):
        """
        8. Plot all vectors in a chart based on the type and color of each vector (using library matplotlib).
        Type should be interpreted as follows: 1 – circle, 2 – square, 3 – triangle, any other value – diamond.
        """
        return self.__vector_repository.plot_vectors_in_chart()

    def get_vectors_of_given_sum(self, summ):
        """
        11. Get the list of vectors having a given sum of elements.
        :param summ: a given sum
        :type summ: int
        """
        return self.__vector_repository.get_vectors_of_given_sum(summ)

    def delete_vectors_between_indexes(self, index1, index2):
        """
        19. Delete all vectors that are between two given indexes.
        :param index1: integer representing an index
        :type index1: int
        :param index2: integer representing an index
        :type index2: int
        """
        return self.__vector_repository.delete_vectors_between_indexes(index1, index2)

    def update_vector_color_by_name_id(self, name_id, color):
        """
        22. Update the color of a vector identified by name_id.
        :param name_id: unique identifier (id) of a vector
        :type name_id: str
        :param color: color of the vector
        :type color: str (possible values ‘r’, ‘g’, ‘b’, ‘y’ and ‘m’)
        :return: the vector at the given name_id with its color updated in the repository
        """
        return self.__vector_repository.update_vector_color_by_name_id(name_id, color)