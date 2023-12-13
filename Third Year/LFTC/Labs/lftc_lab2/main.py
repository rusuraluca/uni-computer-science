from test.tests_hashtable import TestHashTable
from test.tests_symbol_table_constants import TestSymbolTableConstants
from test.tests_symbol_table_identifiers import TestSymbolTableIdentifiers


def run_tests():
    test_table = TestHashTable()
    test_table.test_hashtable()
    
    test_table = TestSymbolTableConstants()
    test_table.test_symbol_table_constants()
    
    test_table = TestSymbolTableIdentifiers()
    test_table.test_symbol_table_identifiers()

def main():
    print("Tests started...")
    run_tests()
    print("Tests passed!")
    
if __name__ == "__main__":
    main()
