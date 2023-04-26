import copy
from collections import deque

class TripleDictGraph:
    def __init__(self, number_of_vertices, number_of_edges):
        self._number_of_vertices = number_of_vertices
        self._number_of_edges = number_of_edges
        self._dictionary_in = {}
        self._dictionary_out = {}
        self._dictionary_cost = {}
        for index in range(number_of_vertices):
            self._dictionary_in[index] = []
            self._dictionary_out[index] = []

    @property
    def dictionary_cost(self):
        return self._dictionary_cost

    @property
    def dictionary_in(self):
        return self._dictionary_in

    @property
    def dictionary_out(self):
        return self._dictionary_out

    @property
    def number_of_vertices(self):
        return self._number_of_vertices

    @property
    def number_of_edges(self):
        return self._number_of_edges

    def set_number_of_vertices(self, vertices):
        self._number_of_vertices = vertices

    def set_dictionary_cost(self, dictionary_cost):
        self._dictionary_cost = dictionary_cost

    def set_dictionary_in(self, dictionary_in):
        self._dictionary_in = dictionary_in

    def set_dictionary_out(self, dictionary_out):
        self._dictionary_out = dictionary_out

    def parse_vertices(self):
        vertices = list(self._dictionary_in.keys())
        for v in vertices:
            yield v

    def parse_inbound(self, x):
        for y in self._dictionary_in[x]:
            yield y

    def parse_outbound(self, x):
        for y in self._dictionary_out[x]:
            yield y

    def parse_cost(self):
        keys = list(self._dictionary_cost.keys())
        for key in keys:
            yield key

    def add_vertex(self, x):
        if x in self._dictionary_in.keys() and x in self._dictionary_out.keys():
            return False
        self._dictionary_in[x] = []
        self._dictionary_out[x] = []
        self._number_of_vertices += 1
        return True

    def remove_vertex(self, x):
        if x not in self._dictionary_in.keys() and x not in self._dictionary_out.keys():
            return False

        keys = self._dictionary_out[x]
        for key in keys:
            if x in self._dictionary_in[key]:
                self._dictionary_in[key].remove(x)

        keys = self._dictionary_in[x]
        for key in keys:
            if x in self._dictionary_out[key]:
                self._dictionary_out[key].remove(x)

        self._dictionary_in.pop(x)
        self._dictionary_out.pop(x)

        keys = list(self._dictionary_cost.keys())
        for key in keys:
            if key[0] == x or key[1] == x:
                self._dictionary_cost.pop(key)
                self._number_of_edges -= 1
        self._number_of_vertices -= 1
        return True

    def in_degree(self, x):
        if x not in self._dictionary_in.keys():
            return -1
        return len(self._dictionary_in[x])

    def out_degree(self, x):
        if x not in self._dictionary_out.keys():
            return -1
        return len(self._dictionary_out[x])

    def add_edge(self, x, y, cost):
        if x in self._dictionary_in[y]:
            return False
        elif y in self._dictionary_out[x]:
            return False
        elif (x, y) in self._dictionary_cost.keys():
            return False
        self._dictionary_in[y].append(x)
        self._dictionary_out[x].append(y)
        self._dictionary_cost[(x, y)] = cost
        self._number_of_edges += 1
        return True

    def remove_edge(self, x, y):
        if x not in self._dictionary_in.keys() or y not in self._dictionary_in.keys() or x not in self._dictionary_out.keys() or y not in self._dictionary_out.keys():
            return False
        if x not in self._dictionary_in[y]:
            return False
        elif y not in self._dictionary_out[x]:
            return False
        elif (x, y) not in self._dictionary_cost.keys():
            return False
        self._dictionary_in[y].remove(x)
        self._dictionary_out[x].remove(y)
        self._dictionary_cost.pop((x, y))
        self._number_of_edges -= 1
        return True

    def find_if_edge(self, x, y):
        if x in self._dictionary_in[y]:
            return self._dictionary_cost[(x, y)]
        elif y in self._dictionary_out[x]:
            return self._dictionary_cost[(x, y)]
        return False

    def change_cost(self, x, y, cost):
        if (x, y) not in self._dictionary_cost.keys():
            return False
        self._dictionary_cost[(x, y)] = cost
        return True

    def make_copy(self):
        return copy.deepcopy(self)

    def find_lowest_length_path(self, start_vertex, end_vertex):
        """
        Finds the lowest length path between start_vertex and end_vertex using backward breadth-first search from the
        end_vertex.

        :param start_vertex: The starting vertex.
        :param end_vertex: The ending vertex.
        :return: The lowest length path as a list of vertices, or None if there is no path.
        """
        # check if start_vertex and end_vertex are valid vertices
        if start_vertex not in self._dictionary_in.keys() or end_vertex not in self._dictionary_in.keys():
            return (-1, -1)

        # perform backward BFS from the end_vertex
        queue = deque([(end_vertex, [end_vertex], 0)])
        visited = set()

        while queue:
            vertex, path, length = queue.popleft()

            if vertex in visited:
                continue

            visited.add(vertex)

            for parent in self._dictionary_in[vertex]:

                if vertex == start_vertex:
                    # found a path from start_vertex to end_vertex
                    return list(reversed(path)), length

                queue.append((parent, path + [parent], length + 1))

        # there is no path from start_vertex to end_vertex
        return (0, 0)

    def find_lowest_length_path2(self, start_vertex, end_vertex):
        """
        Finds the lowest length path between start_vertex and end_vertex using backward breadth-first search from the
        end_vertex.

        :param start_vertex: The starting vertex.
        :param end_vertex: The ending vertex.
        :return: The lowest length path as a list of vertices, or None if there is no path.
        """
        # check if start_vertex and end_vertex are valid vertices
        if start_vertex not in self._dictionary_in.keys() or end_vertex not in self._dictionary_in.keys():
            return (-1, -1)

        # perform backward BFS from the end_vertex
        queue = deque([end_vertex])
        visited = set()

        # stores the distance from end_vertex to each visited vertex
        dist_dictionary = {}
        dist_dictionary[end_vertex] = 0
        # stores the next vertex in the path for each visited vertex
        next_dictionary = {}

        while queue:
            vertex = queue.popleft()

            if vertex in visited:
                continue

            visited.add(vertex)

            for parent in self._dictionary_in[vertex]:

                if vertex == start_vertex:
                    # found a path from start_vertex to end_vertex
                    path = []
                    next_vertex = start_vertex
                    path.append(next_vertex)
                    while next_vertex != end_vertex:
                        next_vertex = next_dictionary[next_vertex]
                        path.append(next_vertex)

                    return path, dist_dictionary[start_vertex]

                queue.append(parent)
                # update dist_dictionary and next_dictionary for the visited vertex
                # store the value in a temporary variable
                dist = dist_dictionary[vertex] + 1
                dist_dictionary[parent] = dist
                next_dictionary[parent] = vertex

        queue.clear()

        # end_vertex was not visited, indicating no path was found
        return (0, 0)

    def find_lowest_cost_walk(self, start_vertex, end_vertex):
        # Step 1: Initialize distances to infinity for all vertices except the start vertex,
        # which is set to 0.
        distances = {v: float('inf') for v in self.parse_vertices()}
        distances[start_vertex] = 0

        # Step 2: Relax edges repeatedly V-1 times
        for _ in range(self.number_of_vertices - 1):
            for u in self.parse_vertices():
                for v in self.parse_outbound(u):
                    # Relax edge (u, v)
                    cost = self.find_if_edge(u, v)
                    if distances[u] + cost < distances[v]:
                        distances[v] = distances[u] + cost

        # Step 3: Check for negative cost cycles
        for u in self.parse_vertices():
            for v in self.parse_outbound(u):
                # Relax edge (u, v) one more time
                cost = self.find_if_edge(u, v)
                if distances[u] + cost < distances[v]:
                    print("Negative cost cycle detected from vertex", u)
                    return None

        # Step 4: Construct the minimum cost path from start_vertex to end_vertex
        path = [end_vertex]
        current_vertex = end_vertex
        while current_vertex != start_vertex:
            for v in self.parse_inbound(current_vertex):
                if distances[v] + self.find_if_edge(v, current_vertex) == distances[current_vertex]:
                    path.append(v)
                    current_vertex = v
                    break
        path.reverse()

        return path, distances[end_vertex]


def write_graph_to_file(graph, file):
    file = open(file, "w")
    if graph.number_of_vertices and graph.number_of_edges:
        first_line = str(graph.number_of_vertices) + ' ' + str(graph.number_of_edges) + '\n'
        file.write(first_line)
        if len(graph.dictionary_cost) == 0 and len(graph.dictionary_in) == 0:
            raise ValueError("There is nothing that can be written!")
        for edge in graph.dictionary_cost.keys():
            new_line = "{} {} {}\n".format(edge[0], edge[1], graph.dictionary_cost[edge])
            file.write(new_line)
        for vertex in graph.dictionary_in.keys():
            if len(graph.dictionary_in[vertex]) == 0 and len(graph.dictionary_out[vertex]) == 0:
                new_line = "{}\n".format(vertex)
                file.write(new_line)
    else:
        first_line = 'We cannot create this graph' + '\n'
        file.write(first_line)
    file.close()


def write_modified_graph_to_file(graph, file):
    file = open(file, "w")
    if len(graph.dictionary_cost) == 0 and len(graph.dictionary_in) == 0:
        raise ValueError("There is nothing that can be written!")
    for edge in graph.dictionary_cost.keys():
        new_line = "{} {} {}\n".format(edge[0], edge[1], graph.dictionary_cost[edge])
        file.write(new_line)
    for vertex in graph.dictionary_in.keys():
        if len(graph.dictionary_in[vertex]) == 0 and len(graph.dictionary_out[vertex]) == 0:
            new_line = "{}\n".format(vertex)
            file.write(new_line)
    file.close()


def read_graph_from_file(filename):
    file = open(filename, "r")
    line = file.readline()
    line = line.strip()
    vertices, edges = line.split(' ')
    graph = TripleDictGraph(int(vertices), int(edges))
    line = file.readline().strip()
    while len(line) > 0:
        line = line.split(' ')
        if len(line) == 1:
            graph.dictionary_in[int(line[0])] = []
            graph.dictionary_out[int(line[0])] = []
        elif len(line) == 3:
            graph.dictionary_in[int(line[1])].append(int(line[0]))
            graph.dictionary_out[int(line[0])].append(int(line[1]))
            graph.dictionary_cost[(int(line[0]), int(line[1]))] = int(line[2])
        line = file.readline().strip()
    file.close()
    return graph


def read_modified_graph_from_file(filename):
    file = open(filename, "r")
    line = file.readline().strip()
    dictionary_in = {}
    dictionary_out = {}
    dictionary_cost = {}
    vertices, edges = 0, 0
    while len(line) > 0:
        line = line.split(' ')
        if len(line) == 1:
            dictionary_in[int(line[0])] = []
            dictionary_out[int(line[0])] = []
        elif len(line) == 3:
            dictionary_in[int(line[0])] = []
            dictionary_out[int(line[0])] = []
            dictionary_in[int(line[1])] = []
            dictionary_out[int(line[1])] = []
            edges += 1
            dictionary_in[int(line[1])].append(int(line[0]))
            dictionary_out[int(line[0])].append(int(line[1]))
            dictionary_cost[(int(line[0]), int(line[1]))] = int(line[2])
        line = file.readline().strip()
    for key in dictionary_in.keys():
        vertices += 1
    graph = TripleDictGraph(int(vertices), int(edges))
    graph.set_dictionary_cost(dictionary_cost)
    graph.set_dictionary_in(dictionary_in)
    graph.set_dictionary_out(dictionary_out)
    file.close()
    return graph