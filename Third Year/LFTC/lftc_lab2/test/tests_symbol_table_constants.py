import unittest
from models.symboltables import SymbolTableConstants


class TestSymbolTableConstants(unittest.TestCase):
    def __init__(self):
        self.constants = SymbolTableConstants()
    
    def test_symbol_table_constants(self):
        self.constants.add_constant(1, 3)
        self.assert_(self.constants.get_constant(1)) == 3
        self.constants.add_constant(2, "abc")
        self.assert_(self.constants.get_constant(2)) == "abc"