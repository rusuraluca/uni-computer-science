import unittest
from models.hashtable import HashTable


class TestHashTable(unittest.TestCase):
    def __init__(self):
        self.table = HashTable()    
        
    def test_hashtable(self):
        self.table.insert("a", 1)
        self.assert_(self.table.get("a")) == 1