import unittest
from models.hashtable import HashTable


class TestHashTable(unittest.TestCase):
    def __init__(self):
        self.table = HashTable()    
        
    def test_hashtable(self):
        self.table.insert("a", 1)
        assert(self.table.get("a")) == 1
        self.table.insert("b", 2)
        assert(self.table.get("b")) == 2
        self.table.insert("c", 3)
        assert(self.table.get("c")) == 3
        self.table.insert("d", 4)
        assert(self.table.get("d")) == 4
        self.table.insert("e", 4)
        assert(self.table.get("e")) == 4
