import copy


class DirectedGraph:
    def __init__(self, number_of_vertices, number_of_edges):
        self.number_of_vertices = number_of_vertices
        self.number_of_edges = number_of_edges
        self.d_in = {}
        self.d_out = {}
        self.d_cost = {}
        for index in range(number_of_vertices):
            self.d_in[index] = []
            self.d_out[index] = []

    @property
    def dictionary_in(self):
        return self.d_in

    @property
    def dictionary_out(self):
        return self.d_out

    @property
    def dictionary_cost(self):
        return self.d_cost

    @property
    def number_of_vertices(self):
        return self.number_of_vertices

    @property
    def number_of_edges(self):
        return self.number_of_edges

    def parse_vertices(self):
        vertices = list(self.d_in.keys())
        for v in vertices:
            yield v

    def parse_inbound(self, x):
        for y in self.d_in[x]:
            yield y

    def parse_outbound(self, x):
        for y in self.d_out[x]:
            yield y

    def parse_cost(self):
        keys = list(self.d_cost.keys())
        for key in keys:
            yield key

    def add_vertex(self, x):
        if x in self.d_in.keys() and x in self.d_out.keys():
            return False
        self.d_in[x] = []
        self.d_out[x] = []
        self.number_of_vertices += 1
        return True

    def remove_vertex(self, x):
        if x not in self.d_in.keys() and x not in self.d_out.keys():
            return False
        self.d_in.pop(x)
        self.d_out.pop(x)
        for key in self.d_in.keys():
            if x in self.d_in[key]:
                self.d_in[key].remove(x)
            elif x in self.d_out[key]:
                self.d_out[key].remove(x)
        keys = list(self.d_cost.keys())
        for key in keys:
            if key[0] == x or key[1] == x:
                self.d_cost.pop(key)
                self.number_of_edges -= 1
        self.number_of_vertices -= 1
        return True

    def in_degree(self, x):
        if x not in self.d_in.keys():
            return -1
        return len(self.d_in[x])

    def out_degree(self, x):
        if x not in self.d_out.keys():
            return -1
        return len(self.d_out[x])

    def add_edge(self, x, y, cost):
        if x in self.d_in[y]:
            return False
        elif y in self.d_out[x]:
            return False
        elif (x, y) in self.d_cost.keys():
            return False
        self.d_in[y].append(x)
        self.d_out[x].append(y)
        self.d_cost[(x, y)] = cost
        self.number_of_edges += 1
        return True

    def remove_edge(self, x, y):
        if x not in self.d_in.keys() or y not in self.d_in.keys() or x not in self.d_out.keys() or y not in self.d_out.keys():
            return False
        if x not in self.d_in[y]:
            return False
        elif y not in self.d_out[x]:
            return False
        elif (x, y) not in self.d_cost.keys():
            return False
        self.d_in[y].remove(x)
        self.d_out[x].remove(y)
        self.d_cost.pop((x, y))
        self.number_of_edges -= 1
        return True

    def find_if_edge(self, x, y):
        if x in self.d_in[y]:
            return self.d_cost[(x, y)]
        elif y in self.d_out[x]:
            return self.d_cost[(x, y)]
        return False

    def change_cost(self, x, y, cost):
        if (x, y) not in self.d_cost.keys():
            return False
        self.d_cost[(x, y)] = cost
        return True

    def make_copy(self):
        return copy.deepcopy(self)

    @number_of_vertices.setter
    def number_of_vertices(self, value):
        self._number_of_vertices = value

    @number_of_edges.setter
    def number_of_edges(self, value):
        self._number_of_edges = value


def write_graph_to_file(graph, file):
    file = open(file, "w")
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
    file.close()


def read_graph_from_file(filename):
    file = open(filename, "r")
    line = file.readline()
    line = line.strip()
    vertices, edges = line.split(' ')
    graph = DirectedGraph(int(vertices), int(edges))
    line = file.readline().strip()
    while len(line) > 0:
        line = line.split(' ')
        if len(line) == 1:
            graph.dictionary_in[int(line[0])] = []
            graph.dictionary_out[int(line[0])] = []
        else:
            graph.dictionary_in[int(line[1])].append(int(line[0]))
            graph.dictionary_out[int(line[0])].append(int(line[1]))
            graph.dictionary_cost[(int(line[0]), int(line[1]))] = int(line[2])
        line = file.readline().strip()
    file.close()
    return graph
