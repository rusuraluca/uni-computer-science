from .hashtable import HashTable


class SymbolTableConstants:
    def __init__(self):
        self.symboltable = HashTable()

    def add_constant(self, identifier, value):
        self.symboltable.insert(identifier, value)

    def get_constant(self, identifier):
        return self.symboltable.get(identifier)


class SymbolTableIdentifiers:
    def __init__(self):
        self.symboltable = HashTable()

    def add_identifier(self, identifier, value):
        self.symboltable.insert(identifier, value)

    def get_identifier_value(self, identifier):
        return self.symboltable.get(identifier)
