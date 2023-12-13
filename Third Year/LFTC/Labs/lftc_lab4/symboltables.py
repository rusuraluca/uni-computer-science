from hashtable import HashTable


class SymbolTableConstants:
    """ Symbol table for constants

    Attributes:
        symboltable (HashTable): HashTable for constants
    """
    def __init__(self):
        self.symboltable = HashTable()

    def add_constant(self, identifier, value):
        self.symboltable.insert(identifier, value)

    def get_constant(self, identifier):
        return self.symboltable.get(identifier)

    def get_position(self, identifier):
        return self.symboltable.get_position(identifier)


class SymbolTableIdentifiers:
    """ Symbol table for identifiers
    
    Attributes:
        symboltable (HashTable): HashTable for identifiers
    """
    def __init__(self): 
        self.symboltable = HashTable()

    def add_identifier(self, identifier, value):
        self.symboltable.insert(identifier, value)

    def get_identifier_value(self, identifier):
        return self.symboltable.get(identifier)

    def get_position(self, identifier):
        return self.symboltable.get_position(identifier)
