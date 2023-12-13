import unittest
from models.symboltables import SymbolTableIdentifiers


class TestSymbolTableIdentifiers(unittest.TestCase):
    def __init__(self):
        self.identifiers = SymbolTableIdentifiers()
    
    def test_symbol_table_identifiers(self):
        self.identifiers.add_identifier("a", 3)
        assert(self.identifiers.get_identifier_value("a")) == 3
        self.identifiers.add_identifier("b", "abc")
        assert(self.identifiers.get_identifier_value("b")) == "abc"
        self.identifiers.add_identifier("c", 7)
        assert(self.identifiers.get_identifier_value("c")) == 7
        self.identifiers.add_identifier("d", "str")
        assert(self.identifiers.get_identifier_value("d")) == "str"
        self.identifiers.add_identifier("e", 10)
        assert(self.identifiers.get_identifier_value("e")) == 10
        self.identifiers.add_identifier("f", "ooo")
        assert(self.identifiers.get_identifier_value("f")) == "ooo"