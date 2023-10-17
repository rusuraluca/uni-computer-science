import unittest
from models.symboltables import SymbolTableIdentifiers


class TestSymbolTableIdentifiers(unittest.TestCase):
    def __init__(self):
        self.identifiers = SymbolTableIdentifiers()
    
    def test_symbol_table_identifiers(self):
        self.identifiers.add_identifier("a", 3)
        self.assert_(self.identifiers.get_identifier_value("a")) == 3
        self.identifiers.add_identifier("b", "abc")
        self.assert_(self.identifiers.get_identifier_value("b")) == "abc"