#include <iostream>
#include "graph.cpp"
#include <fstream>
#include <string>
#include <sstream>
#include <unordered_map>
#include <vector>
#include <random>
#include <chrono>


void write_graph_to_file(TripleDictGraph graph, std::string filename) {
    std::ofstream file;
    file.open(filename);
    if (graph.number_of_vertices() && graph.number_of_edges()) {
        std::string first_line = std::to_string(graph.number_of_vertices()) + ' ' + std::to_string(graph.number_of_edges()) + '\n';
        file << first_line;
        if (graph.dictionary_cost().empty() && graph.dictionary_in().empty()) {
            throw std::invalid_argument("There is nothing that can be written!");
        }
        for (auto& edge : graph.dictionary_cost()) {
            std::string new_line = std::to_string(edge.first.first) + ' ' + std::to_string(edge.first.second) + ' ' + std::to_string(edge.second) + '\n';
            file << new_line;
        }
        for (auto& vertex : graph.dictionary_in()) {
            if (vertex.second.empty() && graph.dictionary_out().at(vertex.first).empty()) {
                std::string new_line = std::to_string(vertex.first) + '\n';
                file << new_line;
            }
        }
    } else {
        std::string first_line = "We cannot create this graph\n";
        file << first_line;
    }
    file.close();
}

void write_modified_graph_to_file(TripleDictGraph graph, std::string file) {
    std::ofstream output_file(file);
    if (graph.dictionary_cost().empty() && graph.dictionary_in().empty()) {
        output_file << "There is nothing that can be written!\n";
        output_file.close();
        return;
    }
    for (auto const& edge : graph.dictionary_cost()) {
        std::stringstream new_line;
        new_line << edge.first.first << " " << edge.first.second << " " << edge.second << "\n";
        output_file << new_line.str();
    }
    for (auto const& vertex : graph.dictionary_in()) {
        if (vertex.second.empty() && graph.dictionary_out().at(vertex.first).empty()) {
            std::stringstream new_line;
            new_line << vertex.first << "\n";
            output_file << new_line.str();
        }
    }
    output_file.close();
}

void read_graph_from_file(TripleDictGraph& graph, std::string filename) {
    std::ifstream file;
    file.open(filename);
    std::string line;
    std::getline(file, line);
    std::stringstream ss(line);
    int vertices, edges;
    ss >> vertices >> edges;
    graph.set_number_of_vertices(vertices);
    for (int i = 0; i < edges; ++i) {
        std::getline(file, line);
        std::stringstream ss(line);
        int x, y, cost;
        ss >> x >> y >> cost;
        graph.add_edge(x, y, cost);
    }
    for (int i = 0; i < vertices - edges; ++i) {
        std::getline(file, line);
        std::stringstream ss(line);
        int x;
        ss >> x;
        graph.add_vertex(x);
    }
    file.close();
}

void read_modified_graph_from_file(TripleDictGraph& graph, std::string filename) {
    std::ifstream file;
    file.open(filename);
    std::string line;
    while (std::getline(file, line)) {
        std::stringstream ss(line);
        int x, y, cost;
        ss >> x >> y >> cost;
        graph.add_edge(x, y, cost);
    }
    file.close();
}

class UI {
private:
    std::unordered_map<int, TripleDictGraph> _graphs;
    TripleDictGraph* _current;

public:
    UI() : _graphs(), _current(nullptr) {}

    void add_empty_graph() {
        if (_current == nullptr) {
            _graphs.emplace(0, TripleDictGraph(0, 0));
            _current = &_graphs.at(0);
        } else {
            _graphs.emplace(0, TripleDictGraph(0, 0));
        }
    }

    void read_graph_from_file_ui() {
        std::string filename;
        std::cout << "Enter the name of the file: ";
        std::cin >> filename;

        TripleDictGraph graph = TripleDictGraph(0, 0);
        read_graph_from_file(graph, filename);
        if (_current == nullptr) {
            _graphs.emplace(0, graph);
            _current = &_graphs.at(0);
        } else {
            _graphs.emplace(0, graph);
        }
    }

    void write_graph_to_file_ui() {
        TripleDictGraph &current_graph = *_current;
        std::ostringstream output_file;
        auto it = std::find_if(_graphs.begin(), _graphs.end(), [&](const auto& elem) {
            return &elem.second == &current_graph;
        });
        output_file << "output"
                    << std::distance(_graphs.begin(), it)
                    << ".txt";
        write_graph_to_file(current_graph, output_file.str());
    }

    void read_modified_graph_from_file_ui() {
        std::string filename;
        std::cout << "Enter the name of the file: ";
        std::cin >> filename;

        TripleDictGraph graph = TripleDictGraph(0, 0);
        read_modified_graph_from_file(graph, filename);
        if (_current == nullptr) {
            _graphs.emplace(0, graph);
            _current = &_graphs.at(0);
        } else {
            _graphs.emplace(0, graph);
        }
    }

    void write_modified_graph_to_file_ui() {
        TripleDictGraph &current_graph = *_current;
        std::ostringstream output_file;
        auto it = std::find_if(_graphs.begin(), _graphs.end(), [&](const auto& elem) {
            return &elem.second == &current_graph;
        });
        output_file << "output"
                    << std::distance(_graphs.begin(), it)
                    << ".txt";
        write_modified_graph_to_file(current_graph, output_file.str());
    }

    void get_number_of_vertices_ui(){
        std::cout << "The number of vertices is: " << _current->number_of_vertices() << "." << std::endl;
    }

    void get_number_of_edges_ui(){
        std::cout << "The number of edges is: " << _current->number_of_edges() << "." << std::endl;
    }

    void list_all_outbound(){
        for (auto x : _current->parse_vertices()){
            std::string line = std::to_string(x) + " :";
            for (auto y : _current->parse_outbound(x)){
                line += " " + std::to_string(y);
            }
            std::cout << line << std::endl;
        }
    }

    void list_outbound(){
        int vertex;
        std::cout << "Enter the vertex: ";
        std::cin >> vertex;
        std::string line = std::to_string(vertex) + " :";
        bool vertex_exists = false;
        for (auto v : _current->parse_vertices()) {
            if (v == vertex) {
                vertex_exists = true;
                break;
            }
        }
        if (!vertex_exists) {
            throw std::invalid_argument("Cannot list outbound of this vertex, it does not exist!");
        }
        for (auto y : _current->parse_outbound(vertex)) {
            line += " (" + std::to_string(vertex) + ", " + std::to_string(y) + ")";
        }
        std::cout << line << std::endl;
    }

    void list_all_inbound(){
        for (auto x : _current->parse_vertices()){
            std::string line = std::to_string(x) + " :";
            for (auto y : _current->parse_inbound(x)){
                line += " " + std::to_string(y);
            }
            std::cout << line << std::endl;
        }
    }

    void list_inbound(){
        int vertex;
        std::cout << "Enter the vertex: ";
        std::cin >> vertex;
        std::string line = std::to_string(vertex) + " :";
        bool vertex_exists = false;
        for (auto v : _current->parse_vertices()) {
            if (v == vertex) {
                vertex_exists = true;
                break;
            }
        }
        if (!vertex_exists) {
            throw std::invalid_argument("Cannot list inbound of this vertex, it does not exist!");
        }
        for (auto y : _current->parse_inbound(vertex)) {
            line += " (" + std::to_string(y) + ", " + std::to_string(vertex) + ")";
        }
        std::cout << line << std::endl;
    }

    std::string pair_to_string(const std::pair<int, int>& p) {
        return "(" + std::to_string(p.first) + ", " + std::to_string(p.second) + ")";
    }

    void list_all_costs(){
        for (auto key : _current->parse_cost())
        {
            std::string line = "(" + pair_to_string(key.first) + ", " + std::to_string(key.second) + ") :";
            line += " " + std::to_string(_current->find_if_edge(key.first.first, key.first.second));
            std::cout << line << std::endl;
        }
    }

    void parse_all_vertices(){
        for (auto vertex : _current->parse_vertices())
        {
            std::cout << vertex << std::endl;
        }
    }

    void add_vertex_ui(){
        int vertex;
        std::cout << "Enter the new vertex: ";
        std::cin >> vertex;
        bool added = _current->add_vertex(vertex);
        if (added){
            std::cout << "Vertex added successfully!" << std::endl;
        }
        else{
            std::cout << "Cannot add this vertex, it already exists!" << std::endl;
        }
    }


    void delete_vertex_ui(TripleDictGraph& graph) {
        int vertex;
        std::cout << "Enter the vertex to be deleted: ";
        std::cin >> vertex;
        bool deleted = graph.remove_vertex(vertex);
        if (deleted) {
            std::cout << "Vertex deleted successfully!\n";
        } else {
            std::cout << "Cannot delete this vertex, it does not exist!\n";
        }
    }


    void add_edge_ui(TripleDictGraph& graph) {
        std::cout << "Add an edge (an edge is (x, y))\n";
        int vertex_x, vertex_y, cost;
        std::cout << "Enter x = ";
        std::cin >> vertex_x;
        std::cout << "Enter y = ";
        std::cin >> vertex_y;
        std::cout << "Enter the cost of the edge: ";
        std::cin >> cost;
        bool added = graph.add_edge(vertex_x, vertex_y, cost);
        if (added) {
            std::cout << "Edge added successfully!\n";
        } else {
            std::cout << "Cannot add this edge, it already exists!\n";
        }
    }


    void remove_edge_ui(TripleDictGraph& graph) {
        std::cout << "Remove an edge (an edge is (x, y))\n";
        int vertex_x, vertex_y;
        std::cout << "Enter x = ";
        std::cin >> vertex_x;
        std::cout << "Enter y = ";
        std::cin >> vertex_y;
        bool deleted = graph.remove_edge(vertex_x, vertex_y);
        if (deleted) {
            std::cout << "Edge deleted successfully!\n";
        } else {
            std::cout << "Cannot remove this edge, it does not exist!\n";
        }
    }

    void modify_cost_ui(TripleDictGraph& graph) {
        std::cout << "Modify the cost of an edge (an edge is (x, y))\n";
        int vertex_x, vertex_y, cost;
        std::cout << "Enter x = ";
        std::cin >> vertex_x;
        std::cout << "Enter y = ";
        std::cin >> vertex_y;
        std::cout << "Enter the cost of the edge: ";
        std::cin >> cost;
        bool changed = graph.change_cost(vertex_x, vertex_y, cost);
        if (changed) {
            std::cout << "Cost modified successfully!\n";
        } else {
            std::cout << "Cannot modify the cost, the edge does not exist!\n";
        }
    }

    void get_in_degree_ui(TripleDictGraph& graph) {
        int vertex;
        std::cout << "Enter the vertex: ";
        std::cin >> vertex;
        int degree = graph.in_degree(vertex);
        if (degree == -1) {
            std::cout << "The vertex does not exist!\n";
        } else {
            std::cout << "The in degree of the vertex " << vertex << " is " << degree << ".\n";
        }
    }

    void get_out_degree_ui(TripleDictGraph& graph) {
        int vertex;
        std::cout << "Enter the vertex: ";
        std::cin >> vertex;
        int degree = graph.out_degree(vertex);
        if (degree == -1) {
            std::cout << "The vertex does not exist!\n";
        } else {
            std::cout << "The out degree of the vertex " << vertex << " is " << degree << ".\n";
        }
    }

    void check_if_edge_ui() {
        int vertex_x, vertex_y;
        std::cout << "Enter x = ";
        std::cin >> vertex_x;
        std::cout << "Enter y = ";
        std::cin >> vertex_y;
        auto edge = _current->find_if_edge(vertex_x, vertex_y);
        if (edge != false) {
            std::cout << "(" << vertex_x << ", " << vertex_y << ") is an edge and its cost is " << edge << "!" << std::endl;
        } else {
            std::cout << "(" << vertex_x << ", " << vertex_y << ") is not an edge!" << std::endl;
        }
    }

    void copy_current_graph_ui() {
        TripleDictGraph copy = _current->make_copy();
        _graphs.emplace(0, copy);
    }

    void print_menu() {
        std::cout << "Menu:\n"
             << "0. Exit\n"
             << "1. Create a random graph with specified number of vertices and edges.\n"
             << "2. Read the graph from a text file.\n"
             << "3. Write the graph in a text file.\n"
             << "4. Switch the graph.\n"
             << "5. Get the number of vertices.\n"
             << "6. Get the number of edges.\n"
             << "7. List the outbound edges of a given vertex.\n"
             << "8. List all outbound vertices of the graph.\n"
             << "9. List the inbound edges of a given vertex.\n"
             << "10. List all inbound vertices of the graph. \n"
             << "11. List the edges and their costs.\n"
             << "12. Add a vertex.\n"
             << "13. Remove a vertex.\n"
             << "14. Add an edge.\n"
             << "15. Remove an edge.\n"
             << "16. Modify the cost of an edge.\n"
             << "17. Get the in degree of a vertex.\n"
             << "18. Get the out degree of a vertex.\n"
             << "19. Check if there is an edge between two given vertices.\n"
             << "20. Make a copy of the graph.\n"
             << "21. Add an empty graph.\n"
             << "22. Parse all the vertices.\n"
             << "23. Read the modified graph from a text file.\n"
             << "24. Write the modified graph in a text file." << std::endl;
    }


    void start() {
        std::cout << "Welcome!\n";
        bool done = false;
        add_empty_graph();
        std::cout << "The current graph is an empty graph!\n";

        std::unordered_map<std::string, void (UI::*)()> command_dict;
        command_dict = {
                {"1", &UI::read_graph_from_file_ui},
                {"2", &UI::write_graph_to_file_ui},
                {"5", &UI::get_number_of_vertices_ui},
                {"6", &UI::get_number_of_edges_ui},
                {"7", &UI::list_outbound},
                {"8", &UI::list_all_outbound},
                {"9", &UI::list_inbound},
                {"10", &UI::list_all_inbound},
                {"11", &UI::list_all_costs},
                {"12", &UI::add_vertex_ui},
                {"13", &UI::delete_vertex_ui},
                {"14", &UI::add_edge_ui},
                {"15", &UI::remove_edge_ui},
                {"16", &UI::modify_cost_ui},
                {"17", &UI::get_in_degree_ui},
                {"18", &UI::get_out_degree_ui},
                {"19", &UI::check_if_edge_ui},
                {"20", &UI::copy_current_graph_ui},
                {"21", &UI::add_empty_graph},
                {"22", &UI::parse_all_vertices},
                {"23", &UI::read_modified_graph_from_file_ui},
                {"24", &UI::write_modified_graph_to_file_ui},
        };

        while (!done) {
            try {
                print_menu();
                std::string option;
                std::cin >> option;
                if (option == "0") {
                    done = true;
                } else if (command_dict.find(option) != command_dict.end()) {
                    (this->*(command_dict[option]))();
                } else {
                    std::cout << "Try again!\n";
                }
            } catch (const std::invalid_argument& ia) {
                std::cerr << "Invalid argument: " << ia.what() << '\n';
            } catch (const std::ifstream::failure& f) {
                std::cerr << "File I/O exception: " << f.what() << '\n';
            }
        }
    }
};



int main() {
    UI ui;
    ui.start();
    return 0;
}
