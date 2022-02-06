from application.vector_controller import VectorController
from infrastructure.vector_repository import VectorRepository
from domain.vector_model import MyVector

if __name__ == "__main__":
    controller = VectorController(VectorRepository([
        MyVector("V1", "y", 1, [1, 2.5, 3, 4, 5, 6]),
        MyVector("V2", "r", 2, [0, 0, 15]),
        MyVector("V3", "b", 3, [-1, 2, 9]),
        MyVector("V4", "g", 4, [-4, -2, 25]),
        MyVector("V5", "m", 3, [-1, 2, 9.5]),
    ]))

    print("ORIGINAL REPOSITORY:")
    print(controller)
    print("-" * 100)

    controller.add_vector("V6", "r", 2, [1, 3.5, 4])
    print("AFTER ADDING A NEW VECTOR:")
    print(controller)
    print("-" * 100)

    print("VECTOR AT INDEX 2:")
    print(controller.get_vector_at_index(2), "\n")

    print("VECTOR WITH NAME_ID 'V1':")
    print(controller.get_vector_of_name_id("V1"), "\n")

    print("VECTORS OF SUM = 10:")
    print(controller.get_vectors_of_given_sum(10))
    print("-" * 100)

    controller.update_vector_at_index(0, "V1.1", "g", 34, [1])
    print("UPDATE VECTOR AT INDEX 0:")
    print(controller.get_vector_at_index(0), "\n")

    controller.update_vector_by_name_id("V1.1", "r", 3, [1, 2, 3])
    print("UPDATE VECTOR WITH NAME_ID 'V1.1':")
    print(controller.get_vector_of_name_id("V1.1"), "\n")

    controller.update_vector_color_by_name_id("V1.1", "y")
    print("UPDATE COLOR OF VECTOR OF NAME_ID 'V1.1':")
    print(controller.get_vector_of_name_id("V1.1"), "\n")
    print("-" * 100)

    print("CURRENT STATE OF THE REPOSITORY:")
    print(controller)

    controller.delete_vector_at_index(2)
    print("AFTER DELETING VECTOR AT INDEX 2:")
    print(controller)

    controller.delete_vector_by_name_id("V6")
    print("AFTER DELETING VECTOR WITH NAME_ID 'V6':")
    print(controller)

    controller.delete_vectors_between_indexes(0, 1)
    print("AFTER DELETING VECTORS BETWEEN INDEXES 0-1:")
    print(controller)
    print("-" * 100)
