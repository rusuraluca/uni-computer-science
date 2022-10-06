from ui.console import start
from application.vector_controller import VectorController
from domain.vector_model import MyVector
from infrastructure.vector_repository import VectorRepository


if __name__ == "__main__":
    controller = VectorController(VectorRepository([
        MyVector("V1", "y", 1, [1, 2, 3, 4, 5]),
        MyVector("V2", "r", 2, [-1, -0, -2]),
        MyVector("V3", "b", 3, [12, 13]),
        MyVector("V4", "g", 4, [4, 8, 12]),
        MyVector("V5", "m", 3, [6.5, 7.5, 8.5]),
    ]))
    start(controller)
