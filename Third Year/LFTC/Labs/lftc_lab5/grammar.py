class Grammar:
    def __init__(self, N, E, S, P):
        self.N = N
        self.E = E
        self.S = S
        self.P = P

    def from_file(filename):
        with open(filename, 'r', encoding='utf-8') as file:
            N = set(Grammar.parse_line(file.readline()))
            E = set(Grammar.parse_line(file.readline()))
            S = file.readline().split('=')[1].replace(" ", "").strip()
            file.readline()
            P = Grammar.parse_productions([line.strip() for line in file])
            if not Grammar.validate(N, E, S, P):
                return f"Grammar in {filename} is not valid"

            return Grammar(N, E, S, P)

    def parse_line(line):
        return line.split('=', maxsplit=1)[1].strip().split()

    def parse_productions(lines):
        P = {}
        for line in lines:
            if line == '':
                continue
            lhs, rhs = line.split('->')
            lhs = lhs.strip()
            rhs_list = rhs.strip().split('|')
            if lhs in P:
                P[lhs].append(rhs_list)
            else:
                P[lhs] = [rhs_list]
        return P

    def validate(N, E, S, P):
        if S not in N:
            return False

        for k, v in P.items():
            if k not in N:
                return False

            for production in v:
                for symbol in production:
                    symbol = symbol.strip().split()
                    for s in symbol:
                        if s not in N and s not in E:
                            print(s)
                            return False

        return True

    def is_cfg(self):
        for key in self.P.keys():
            if key not in self.N:
                return False
        return True

    def get_nonterminal_productions(self, nonterminal):
        if nonterminal not in self.N:
            raise Exception('Can only show productions for non-terminals')
        return self.P[nonterminal]

    def get_nonterminals(self):
        return self.N

    def get_terminals(self):
        return self.E

    def __str__(self) -> str:
        return f"N = {self.get_nonterminals()}\nE = {self.get_terminals()}\nS = {self.S}\nP = {self.P}"