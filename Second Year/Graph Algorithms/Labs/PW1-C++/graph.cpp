//
// Created by Raluca on 30.03.2023.
//
// I am getting a few errors. What is wrong? I am using CLion. I am using C++17. I am using the latest version of CLion. 


#include <vector>
#include <unordered_map>
#include <algorithm>
#include <utility>
#include <unordered_set>

struct pair_hash {
    template <class T1, class T2>
    std::size_t operator() (const std::pair<T1, T2>& p) const {
        auto h1 = std::hash<T1>{}(p.first);
        auto h2 = std::hash<T2>{}(p.second);
        return h1 ^ h2;
    }
};


class TripleDictGraph {
public:
    TripleDictGraph(int number_of_vertices, int number_of_edges) :
            _number_of_vertices(number_of_vertices),
            _number_of_edges(number_of_edges)
    {
        for (int index = 0; index < number_of_vertices; ++index) {
            _dictionary_in[index] = {};
            _dictionary_out[index] = {};
        }
    }

    std::unordered_map<std::pair<int, int>, int> dictionary_cost() const {
        return _dictionary_cost;
    }

    std::unordered_map<int, std::vector<int>> dictionary_in() const {
        return _dictionary_in;
    }

    std::unordered_map<int, std::vector<int>> dictionary_out() const {
        return _dictionary_out;
    }

    int number_of_vertices() const {
        return _number_of_vertices;
    }

    int number_of_edges() const {
        return _number_of_edges;
    }

    std::vector<int> parse_vertices() const {
        std::vector<int> vertices;
        for (const auto& entry : _dictionary_in) {
            vertices.push_back(entry.first);
        }
        return vertices;
    }

    std::vector<int> parse_inbound(int x) const {
        return _dictionary_in.at(x);
    }

    std::vector<int> parse_outbound(int x) const {
        return _dictionary_out.at(x);
    }

    std::vector<std::pair<int, int>> parse_cost() const {
        std::vector<std::pair<int, int>> keys;
        for (const auto& entry : _dictionary_cost) {
            keys.push_back(entry.first);
        }
        return keys;
    }

    bool add_vertex(int x) {
        if (_dictionary_in.find(x) != _dictionary_in.end() &&
            _dictionary_out.find(x) != _dictionary_out.end()) {
            return false;
        }
        _dictionary_in[x] = {};
        _dictionary_out[x] = {};
        ++_number_of_vertices;
        return true;
    }

    bool remove_vertex(int x) {
        if (_dictionary_in.find(x) == _dictionary_in.end() &&
            _dictionary_out.find(x) == _dictionary_out.end()) {
            return false;
        }
        _dictionary_in.erase(x);
        _dictionary_out.erase(x);
        for (auto& entry : _dictionary_in) {
            entry.second.erase(std::remove(entry.second.begin(), entry.second.end(), x), entry.second.end());
        }
        for (auto& entry : _dictionary_out) {
            entry.second.erase(std::remove(entry.second.begin(), entry.second.end(), x), entry.second.end());
        }
        std::vector<std::pair<int, int>> keys_to_remove;
        for (const auto& entry : _dictionary_cost) {
            if (entry.first.first == x || entry.first.second == x) {
                keys_to_remove.push_back(entry.first);
                --_number_of_edges;
            }
        }
        for (const auto& key : keys_to_remove) {
            _dictionary_cost.erase(key);
        }
        --_number_of_vertices;
        return true;
    }

    bool add_edge(int x, int y, int cost) {
        if (_dictionary_in[y].count(x)) {
            return false;
        } else if (_dictionary_out[x].count(y)) {
            return false;
        } else if (_dictionary_cost.find(std::make_pair(x, y)) != _dictionary_cost.end()) {
            return false;
        }

        _dictionary_in[y].insert(x);
        _dictionary_out[x].insert(y);
        _dictionary_cost[std::make_pair(x, y)] = cost;
        _number_of_edges++;
        return true;
    }

    bool remove_edge(int x, int y) {
        if (_dictionary_in.find(y) == _dictionary_in.end() || _dictionary_in.find(x) == _dictionary_in.end() || _dictionary_out.find(y) == _dictionary_out.end() || _dictionary_out.find(x) == _dictionary_out.end()) {
            return false;
        } else if (!_dictionary_in[y].count(x)) {
            return false;
        } else if (!_dictionary_out[x].count(y)) {
            return false;
        } else if (_dictionary_cost.find(std::make_pair(x, y)) == _dictionary_cost.end()) {
            return false;
        }

        _dictionary_in[y].erase(x);
        _dictionary_out[x].erase(y);
        _dictionary_cost.erase(std::make_pair(x, y));
        _number_of_edges--;
        return true;
    }

    int in_degree(int x) const {
        if (_dictionary_in.find(x) == _dictionary_in.end()) {
            return -1;
        }
        return _dictionary_in.at(x).size();
    }

    int out_degree(int x) const {
        if (_dictionary_out.find(x) == _dictionary_out.end()) {
            return -1;
        }
        return _dictionary_out.at(x).size();
    }

    int find_if_edge(int x, int y) const {
        if (_dictionary_in[y].count(x)) {
            return _dictionary_cost.at(std::make_pair(x, y));
        } else if (_dictionary_out[x].count(y)) {
            return _dictionary_cost.at(std::make_pair(x, y));
        }
        return false;
    }

    bool change_cost(int x, int y, int cost) {
        if (_dictionary_cost.find(std::make_pair(x, y)) == _dictionary_cost.end()) {
            return false;
        }
        _dictionary_cost[std::make_pair(x, y)] = cost;
        return true;
    }

    TripleDictGraph make_copy() const {
        return TripleDictGraph(*this);
    }

private:
    int _number_of_vertices;
    int _number_of_edges;
    std::unordered_map<int, std::unordered_set<int>> _dictionary_in;
    std::unordered_map<int, std::unordered_set<int>> _dictionary_out;
    std::unordered_map<std::pair<int, int>, int, pair_hash> _dictionary_cost;
};
