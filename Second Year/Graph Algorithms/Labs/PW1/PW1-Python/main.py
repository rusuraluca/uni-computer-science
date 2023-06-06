from random import randint

from graph import TripleDictGraph, write_graph_to_file, read_graph_from_file, write_modified_graph_to_file, read_modified_graph_from_file


class UI:
    def __init__(self):
        self._graphs = []
        self._current = None

    def add_empty_graph(self):
        if self._current is None:
            self._current = 0
        graph = TripleDictGraph(0, 0)
        self._graphs.append(graph)
        self._current = len(self._graphs) - 1

    def create_random_graph_ui(self):
        vertices = int(input("Enter the number of vertices: "))
        edges = int(input("Enter the number of edges: "))
        if edges > vertices * vertices:
            graph = TripleDictGraph(0, 0)
            raise ValueError("Too many edges!")
        else:
            graph = self.generate_random(vertices, edges)
        if self._current is None:
            self._current = 0
        self._graphs.append(graph)
        self._current = len(self._graphs) - 1

    def generate_random(self, vertices, edges):
        graph = TripleDictGraph(vertices, 0)
        i = 0
        while i < edges:
            x = randint(0, vertices - 1)
            y = randint(0, vertices - 1)
            cost = randint(0, 500)
            if graph.add_edge(x, y, cost):
                i += 1
        return graph

    def read_graph_from_file_ui(self):
        filename = input("Enter the name of the file: ")
        if self._current is None:
            self._current = 0
        graph = read_graph_from_file(filename)
        self._graphs.append(graph)
        self._current = len(self._graphs) - 1

    def write_graph_to_file_ui(self):
        current_graph = self._graphs[self._current]
        output_file = "output" + str(self._current) + ".txt"
        write_graph_to_file(current_graph, output_file)

    def read_modified_graph_from_file_ui(self):
        filename = input("Enter the name of the file: ")
        if self._current is None:
            self._current = 0
        graph = read_modified_graph_from_file(filename)
        self._graphs.append(graph)
        self._current = len(self._graphs) - 1

    def write_modified_graph_to_file_ui(self):
        current_graph = self._graphs[self._current]
        output_file = "output" + str(self._current) + ".txt"
        write_modified_graph_to_file(current_graph, output_file)

    def switch_graph_ui(self):
        print("You are on the graph number: {}".format(self._current))
        print("Available graphs: from 0 - {}".format(str(len(self._graphs) - 1)))
        number = int(input("Enter the graph number you want to switch to: "))
        if not 0 <= number < len(self._graphs):
            raise ValueError("Trying to switch to a non existing graph!")
        self._current = number

    def get_number_of_vertices_ui(self):
        print("The number of vertices is: {}.".format(self._graphs[self._current].number_of_vertices))

    def get_number_of_edges_ui(self):
        print("The number of edges is: {}.".format(self._graphs[self._current].number_of_edges))

    def list_all_outbound(self):
        for x in self._graphs[self._current].parse_vertices():
            line = str(x) + " :"
            for y in self._graphs[self._current].parse_outbound(x):
                line = line + " " + str(y)
            print(line)

    def list_outbound(self):
        vertex = int(input("Enter the vertex: "))
        line = str(vertex) + " :"
        if vertex not in self._graphs[self._current].parse_vertices():
            raise ValueError("Cannot list outbound of this vertex, it does not exist!")
        for y in self._graphs[self._current].parse_outbound(vertex):
            line = line + " " + "({}, {})".format(str(vertex), str(y))
        print(line)

    def list_all_inbound(self):
        for x in self._graphs[self._current].parse_vertices():
            line = str(x) + " :"
            for y in self._graphs[self._current].parse_inbound(x):
                line = line + " " + str(y)
            print(line)

    def list_inbound(self):
        vertex = int(input("Enter the vertex: "))
        line = str(vertex) + " :"
        if vertex not in self._graphs[self._current].parse_vertices():
            raise ValueError("Cannot list inbound of this vertex, it does not exist!")
        for y in self._graphs[self._current].parse_inbound(vertex):
            line = line + " " + "({}, {})".format(str(y), str(vertex))
        print(line)

    def list_all_costs(self):
        for key in self._graphs[self._current].parse_cost():
            line = "({}, {})".format(key[0], key[1]) + " :" + str(self._graphs[self._current].dictionary_cost[key])
            print(line)

    def parse_all_vertices(self):
        for vertex in self._graphs[self._current].parse_vertices():
            print("{}".format(vertex))

    def add_vertex_ui(self):
        vertex = int(input("Enter the new vertex: "))
        added = self._graphs[self._current].add_vertex(vertex)
        if added:
            print("Vertex added successfully!")
        else:
            print("Cannot add this vertex, it already exists!")

    def delete_vertex_ui(self):
        vertex = int(input("Enter the vertex to be deleted: "))
        deleted = self._graphs[self._current].remove_vertex(vertex)
        if deleted:
            print("Vertex deleted successfully!")
        else:
            print("Cannot delete this vertex, it does not exist!")

    def add_edge_ui(self):
        print("Add an edge (an edge is (x, y))")
        vertex_x = int(input("Enter x = "))
        vertex_y = int(input("Enter y = "))
        cost = int(input("Enter the cost of the edge: "))
        added = self._graphs[self._current].add_edge(vertex_x, vertex_y, cost)
        if added:
            print("Edge added successfully!")
        else:
            print("Cannot add this edge, it already exists!")

    def remove_edge_ui(self):
        print("Remove an edge (an edge is (x, y))")
        vertex_x = int(input("Enter x = "))
        vertex_y = int(input("Enter y = "))
        deleted = self._graphs[self._current].remove_edge(vertex_x, vertex_y)
        if deleted:
            print("Edge deleted successfully!")
        else:
            print("Cannot remove this edge, it does not exist!")

    def modify_cost_ui(self):
        print("Modify the cost of an edge (an edge is (x, y))")
        vertex_x = int(input("Enter x = "))
        vertex_y = int(input("Enter y = "))
        cost = int(input("Enter the cost of the edge: "))
        changed = self._graphs[self._current].change_cost(vertex_x, vertex_y, cost)
        if changed:
            print("Cost modified successfully!")
        else:
            print("Cannot modify the cost, the edge does not exist!")

    def get_in_degree_ui(self):
        vertex = int(input("Enter the vertex:"))
        degree = self._graphs[self._current].in_degree(vertex)
        if degree == -1:
            print("The vertex does not exist!")
        else:
            print("The in degree of the vertex {} is {}.".format(vertex, degree))

    def get_out_degree_ui(self):
        vertex = int(input("Enter the vertex:"))
        degree = self._graphs[self._current].out_degree(vertex)
        if degree == -1:
            print("The vertex does not exist!")
        else:
            print("The out degree of the vertex {} is {}.".format(vertex, degree))

    def check_if_edge_ui(self):
        vertex_x = int(input("Enter x = "))
        vertex_y = int(input("Enter y = "))
        edge = self._graphs[self._current].find_if_edge(vertex_x, vertex_y)
        if edge is not False:
            print("({}, {}) is an edge and its cost is {}!".format(vertex_x, vertex_y, edge))
        else:
            print("({}, {}) is not an edge!".format(vertex_x, vertex_y))

    def find_lowest_length_path_ui(self):
        start_vertex = int(input("Enter start vertex = "))
        end_vertex = int(input("Enter end vertex = "))
        if start_vertex < 0 or end_vertex < 0 or (start_vertex == end_vertex):
            print("Vertices are not valid!")
        else:
            path, len_path = self._graphs[self._current].find_lowest_length_path(start_vertex, end_vertex)
            if path == -1 and len_path == -1:
                print("Vertices don't exist in the graph!")
            elif path == 0 and len_path == 0:
                print("There is no path from vertex {} to vertex {}".format(start_vertex, end_vertex))
            else:
                print("Lowest length path from vertex {} to vertex {}: {} and has length {}".format(start_vertex, end_vertex, path, len_path))

    def find_lowest_length_path2_ui(self):
        start_vertex = int(input("Enter start vertex = "))
        end_vertex = int(input("Enter end vertex = "))
        if start_vertex < 0 or end_vertex < 0 or (start_vertex == end_vertex):
            print("Vertices are not valid!")
        else:
            path, len_path = self._graphs[self._current].find_lowest_length_path2(start_vertex, end_vertex)
            if path == -1 and len_path == -1:
                print("Vertices don't exist in the graph!")
            elif path == 0 and len_path == 0:
                print("There is no path from vertex {} to vertex {}".format(start_vertex, end_vertex))
            else:
                print("Lowest length path from vertex {} to vertex {}: {} and has length {}".format(start_vertex,
                                                                                                    end_vertex,
                                                                                                    path,
                                                                                                    len_path))

    def topological_ui(self):
        is_dag, topological_orders = self._graphs[self._current].is_dag_topological_sort()
        if is_dag:
            print("Is DAG: True")
            print("Topological order:")
            print(topological_orders)
        else:
            print("Is DAG: False")

    def find_highest_cost_path_ui(self):
        start_vertex = int(input("Enter start vertex = "))
        end_vertex = int(input("Enter end vertex = "))
        if start_vertex < 0 or end_vertex < 0 or (start_vertex == end_vertex):
            print("Vertices are not valid!")
        else:
            path, cost = self._graphs[self._current].find_highest_cost_path(start_vertex, end_vertex)
            if path is None and cost is None:
                print("No path exists between the vertices")
            elif path == []:
                print("Cycle detected")

            else:
                print("Highest cost path from vertex {} to vertex {}: {} and has cost {}".format(start_vertex,
                                                                                                end_vertex,
                                                                                                path,
                                                                                                cost))

    def find_lowest_cost_walk_ui(self):
        start_vertex = int(input("Enter start vertex = "))
        end_vertex = int(input("Enter end vertex = "))
        if start_vertex < 0 or end_vertex < 0 or (start_vertex == end_vertex):
            print("Vertices are not valid!")
        else:
            path, cost = self._graphs[self._current].find_lowest_cost_walk(start_vertex, end_vertex)
            if path is None:
                print("No walk exists between the vertices")
            else:
                print("Lowest cost walk from vertex {} to vertex {}: {} and has cost {}".format(start_vertex,
                                                                                                 end_vertex,
                                                                                                 path,
                                                                                                 cost))

    def copy_current_graph_ui(self):
        copy = self._graphs[self._current].make_copy()
        self._graphs.append(copy)

    def print_menu(self):
        print("Menu:\n"
              "0. Exit\n" 
              "1. Create a random graph with specified number of vertices and edges.\n"
              "2. Read the graph from a text file.\n"
              "3. Write the graph in a text file.\n"
              "4. Switch the graph.\n" 
              "5. Get the number of vertices.\n"
              "6. Get the number of edges.\n"
              "7. List the outbound edges of a given vertex.\n"
              "8. List all outbound vertices of the graph.\n"
              "9. List the inbound edges of a given vertex.\n"
              "10. List all inbound vertices of the graph. \n"
              "11. List the edges and their costs.\n"
              "12. Add a vertex.\n"
              "13. Remove a vertex.\n"
              "14. Add an edge.\n"
              "15. Remove an edge.\n"
              "16. Modify the cost of an edge.\n"
              "17. Get the in degree of a vertex.\n"
              "18. Get the out degree of a vertex.\n"
              "19. Check if there is an edge between two given vertices.\n"
              "20. Make a copy of the graph.\n"
              "21. Add an empty graph.\n"
              "22. Parse all the vertices.\n"
              "23. Read the modified graph from a text file.\n"
              "24. Write the modified graph in a text file.\n"
              "25. Find the lowest length path between two given vertices.\n"
              "26. Find the lowest length path between two given vertices V2.\n"
              "27. Verify if the corresponding graph is a DAG and performs a topological sorting of the activities using the algorithm based on depth-first traversal (Tarjan's algorithm).\n"
              "28. Finds a highest cost walk between the given vertices, or prints a message if there are negative cost cycles accessible from the starting vertex.\n"
              "29. Find a lowest cost walk between the given vertices, or prints a message if there are negative cost cycles accessible from the starting vertex. The program will use the Ford's algorithm.\n"
              )

    def start(self):
        print("Welcome!")
        done = False
        self.add_empty_graph()
        print("The current graph is an empty graph!")
        command_dict = {"1": self.create_random_graph_ui,
                        "2": self.read_graph_from_file_ui,
                        "3": self.write_graph_to_file_ui,
                        "4": self.switch_graph_ui,
                        "5": self.get_number_of_vertices_ui,
                        "6": self.get_number_of_edges_ui,
                        "7": self.list_outbound,
                        "8": self.list_all_outbound,
                        "9": self.list_inbound,
                        "10": self.list_all_inbound,
                        "11": self.list_all_costs,
                        "12": self.add_vertex_ui,
                        "13": self.delete_vertex_ui,
                        "14": self.add_edge_ui,
                        "15": self.remove_edge_ui,
                        "16": self.modify_cost_ui,
                        "17": self.get_in_degree_ui,
                        "18": self.get_out_degree_ui,
                        "19": self.check_if_edge_ui,
                        "20": self.copy_current_graph_ui,
                        "21": self.add_empty_graph,
                        "22": self.parse_all_vertices,
                        "23": self.read_modified_graph_from_file_ui,
                        "24": self.write_modified_graph_to_file_ui,
                        "25": self.find_lowest_length_path_ui,
                        "26": self.find_lowest_length_path2_ui,
                        "27": self.topological_ui,
                        "28": self.find_highest_cost_path_ui,
                        "29": self.find_lowest_cost_walk_ui,
                        }
        while not done:
            try:
                self.print_menu()
                option = input("Enter a command from the menu: \n")
                if option == "0":
                    done = True
                elif option in command_dict:
                    command_dict[option]()
                else:
                    print("Try again!\n")
            except ValueError as ve:
                print(str(ve))
            except FileNotFoundError as fnfe:
                print(str(fnfe).strip("[Errno 2] "))


UI().start()