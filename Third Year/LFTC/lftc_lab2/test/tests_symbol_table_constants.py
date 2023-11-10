import unittest
from models.symboltables import SymbolTableConstants


class TestSymbolTableConstants(unittest.TestCase):
    def __init__(self):
        self.constants = SymbolTableConstants()
    
    def test_symbol_table_constants(self):
        self.constants.add_constant(1, 3)
        assert(self.constants.get_constant(1)) == 3
        self.constants.add_constant(2, "abc")
        assert(self.constants.get_constant(2)) == "abc"
        self.constants.add_constant(3, 7)
        assert(self.constants.get_constant(3)) == 7
        self.constants.add_constant(4, "str")
        assert(self.constants.get_constant(4)) == "str"
        self.constants.add_constant(5, 10)
        assert(self.constants.get_constant(5)) == 10
        self.constants.add_constant(6, "ooo")
        assert(self.constants.get_constant(6)) == "ooo"
