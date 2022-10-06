def distance(point1, point2):
    """
    Calculating the distance between two points.
    :param point1: list of two integers corresponding to coord_x and coord_y
    :param point2: list of two integers corresponding to coord_x and coord_y
    :return:
    """

    return ((point1[0] - point2[0]) ** 2 + (point1[1] - point2[1]) ** 2) ** (1/2)

