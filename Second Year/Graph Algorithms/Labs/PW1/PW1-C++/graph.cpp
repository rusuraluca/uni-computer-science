#include <unordered_map>
#include <vector>

struct PairHash {
    template <typename T, typename U>
    std::size_t operator()(const std::pair<T, U>& p) const {
        return std::hash<T>()(p.first) ^ std::hash<U>()(p.second);
    }
};

class TripleDictGraph {
private:
    int _number_of_vertices;
    int _number_of_edges;
    std::unordered_map<int, std::vector<int>> _dictionary_in;
    std::unordered_map<int, std::vector<int>> _dictionary_out;
    std::unordered_map<std::pair<int, int>, int, PairHash> _dictionary_cost;

public:
    TripleDictGraph(int number_of_vertices, int number_of_edges) :
            _number_of_vertices(number_of_vertices),
            _number_of_edges(number_of_edges),
            _dictionary_in(number_of_vertices),
            _dictionary_out(number_of_vertices),
            _dictionary_cost() {
        for (int i = 0; i < number_of_vertices; i++) {
            _dictionary_in[i] = std::vector<int>();
            _dictionary_out[i] = std::vector<int>();
        }
    }

    const std::unordered_map<int, std::vector<int>>& dictionary_in() const {
        return _dictionary_in;
    }

    const std::unordered_map<int, std::vector<int>>& dictionary_out() const {
        return _dictionary_out;
    }

    const std::unordered_map<std::pair<int, int>, int, PairHash>& dictionary_cost() const {
        return _dictionary_cost;
    }

    int number_of_vertices() const {
        return _number_of_vertices;
    }

    int number_of_edges() const {
        return _number_of_edges;
    }

    void set_number_of_vertices(int vertices) {
        _number_of_vertices = vertices;
    }

    void set_dictionary_cost(const std::unordered_map<std::pair<int, int>, int, PairHash>& dictionary_cost) {
        _dictionary_cost = dictionary_cost;
    }

    void set_dictionary_in(const std::unordered_map<int, std::vector<int>>& dictionary_in) {
        _dictionary_in = dictionary_in;
    }

    void set_dictionary_out(const std::unordered_map<int, std::vector<int>>& dictionary_out) {
        _dictionary_out = dictionary_out;
    }

    std::vector<int> parse_vertices() {
        std::vector<int> vertices;
        for (auto& x : _dictionary_in) {
            vertices.push_back(x.first);
        }
        return vertices;
    }

    std::vector<int> parse_inbound(int x) {
        return _dictionary_in[x];
    }

    std::vector<int> parse_outbound(int x) {
        return _dictionary_out[x];
    }

    std::vector<std::pair<std::pair<int, int>, int>> parse_cost() {
        std::vector<std::pair<std::pair<int, int>, int>> costs;
        for (auto& x : _dictionary_cost) {
            costs.emplace_back(x.first, x.second);
        }
        return costs;
    }

    bool add_vertex(int x) {
        if (_dictionary_in.find(x) != _dictionary_in.end() && _dictionary_out.find(x) != _dictionary_out.end()) {
            return false;
        }
        _dictionary_in[x] = std::vector<int>();
        _dictionary_out[x] = std::vector<int>();
        _number_of_vertices++;
        return true;
    }

    bool remove_vertex(int x) {
        if (_dictionary_in.find(x) == _dictionary_in.end() && _dictionary_out.find(x) == _dictionary_out.end()) {
            return false;
        }
        _dictionary_in.erase(x);
        _dictionary_out.erase(x);
        for (auto& p : _dictionary_in) {
            auto& v = p.second;
            auto it = std::find(v.begin(), v.end(), x);
            if (it != v.end()) {
                v.erase(it);
            }
        }
        for (auto& p : _dictionary_out) {
            auto& v = p.second;
            auto it = std::find(v.begin(), v.end(), x);
            if (it != v.end()) {
                v.erase(it);
            }
        }
        auto it = _dictionary_cost.begin();
        while (it != _dictionary_cost.end()) {
            auto& k = it->first;
            if (k.first == x || k.second == x) {
                it = _dictionary_cost.erase(it);
                _number_of_edges--;
            } else {
                ++it;
            }
        }
        _number_of_vertices--;
        return true;
    }

    int in_degree(int x) {
        if (_dictionary_in.find(x) == _dictionary_in.end()) {
            return -1;
        }
        return _dictionary_in[x].size();
    }

    int out_degree(int x) {
        if (_dictionary_out.find(x) == _dictionary_out.end()) {
            return -1;
        }
        return _dictionary_out[x].size();
    }

    bool add_edge(int x, int y, int cost) {
        if (_dictionary_in.find(x) == _dictionary_in.end() || _dictionary_out.find(y) == _dictionary_out.end()) {
            return false;
        }
        auto it = _dictionary_cost.find(std::make_pair(x, y));
        if (it != _dictionary_cost.end()) {
            return false;
        }
        _dictionary_in[y].push_back(x);
        _dictionary_out[x].push_back(y);
        _dictionary_cost[std::make_pair(x, y)] = cost;
        _number_of_edges++;
        return true;
    }

    bool remove_edge(int x, int y) {
        if (_dictionary_in.find(x) == _dictionary_in.end() || _dictionary_out.find(y) == _dictionary_out.end()) {
            return false;
        }
        auto it = _dictionary_cost.find(std::make_pair(x, y));
        if (it == _dictionary_cost.end()) {
            return false;
        }
        auto& v_in = _dictionary_in[y];
        auto it_in = std::find(v_in.begin(), v_in.end(), x);
        if (it_in != v_in.end()) {
            v_in.erase(it_in);
        }
        auto& v_out = _dictionary_out[x];
        auto it_out = std::find(v_out.begin(), v_out.end(), y);
        if (it_out != v_out.end()) {
            v_out.erase(it_out);
        }
        _dictionary_cost.erase(it);
        _number_of_edges--;
        return true;
    }

    int find_if_edge(int x, int y) {
        if (std::find(_dictionary_in[y].begin(), _dictionary_in[y].end(), x) != _dictionary_in[y].end()) {
            return _dictionary_cost[{x, y}];
        } else if (std::find(_dictionary_out[x].begin(), _dictionary_out[x].end(), y) != _dictionary_out[x].end()) {
            return _dictionary_cost[{x, y}];
        }
        return false;
    }

    bool change_cost(int x, int y, int cost) {
        if (_dictionary_in.find(x) == _dictionary_in.end() || _dictionary_out.find(y) == _dictionary_out.end()) {
            return false;
        }
        auto it = _dictionary_cost.find(std::make_pair(x, y));
        if (it == _dictionary_cost.end()) {
            return false;
        }
        it->second = cost;
        return true;
    }

    TripleDictGraph make_copy() {
        return *this;
    }
};

