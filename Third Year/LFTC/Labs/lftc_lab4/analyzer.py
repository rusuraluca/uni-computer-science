from enum import Enum
import re
from symboltables import SymbolTableConstants, SymbolTableIdentifiers
from finiteautomata import FiniteAutomata


class TokenTypes(Enum):
    """ Enum for defining the token types
    """
    IDENTIFIER = 0
    CONSTANT = 1
    OPERATOR = 2
    RESERVED_WORD = 3
    SEPARATOR = 4
    

class LexicalAnalyzer():
    """ class LexicalAnalyzer for implementing the scanning algorithm
    
    Methods:
        __init__:
            - initializes the analyzer with the source code file and token file paths.
        - scan_file:
            - analyzes the source code, generates PIF, and manages symbol tables
        - get_tokens:
            - parses the token definitions from the token file and populates dictionaries for reserved words, operators, and separators
        - is_identifier(string):
            - checks if a string is a valid identifier
        - is_constant(string):
            - checks if a string is a valid constant
    """
    def __init__(self, filename, token_file):
        self.filename = filename
        self.token_file = token_file
        self.constant_table = SymbolTableConstants()
        self.identifiers_table = SymbolTableIdentifiers()
        self.pif = []
        self.reserved_words = {}
        self.operators = {}
        self.separators = {}
        self.get_tokens()
        self.constants_count = 0
        self.finite_automata = FiniteAutomata('FA.in')

    def scan_file(self):
        with open(self.filename, 'r') as program:
            line_count = 0
            for line in program:
                line_count += 1
                line = line.replace('\n', '')
                operators_and_separators = '(==|=|!=|\+=|-=|\*=|\/=|<=|>=|[\+\-\*=\/<>!;\[\]\{\}\(\),;]|\|\||&&)'
               
                for word_with_sep_and_op in line.split():
                    for word in re.split(operators_and_separators, word_with_sep_and_op):
                        if word == '':
                            continue
                        
                        if word[0] == '"':
                            word = word[0:]
                            
                        if word[0] == "'":
                            word = word[0:]
                            
                        if word in self.reserved_words:
                            self.pif.append((self.reserved_words[word], 0))
                            
                        elif word in self.operators:
                            self.pif.append((self.operators[word], 0))
                            
                        elif word in self.separators:
                            self.pif.append((self.separators[word], 0))
                            
                        elif self.is_constant(word):
                            if self.constant_table.get_position(word) is None:
                                self.constant_table.add_constant(word, self.constants_count)
                                self.constants_count += 1
                            self.pif.append((TokenTypes.CONSTANT.value, self.constant_table.get_position(self.constants_count - 1)))
                            

                        elif self.is_identifier(word):
                            if self.identifiers_table.get_position(word) is None:
                                self.identifiers_table.add_identifier(word, None)
                            self.pif.append((TokenTypes.IDENTIFIER.value, self.identifiers_table.get_position(word)))
                            
                        else:
                            print(f'Lexical error at line {line_count}')
                            return
                        
            print('Lexically correct')
            
        with open('ST.out', 'w') as output:
            print(str(self.identifiers_table.symboltable))
            print(str(self.constant_table.symboltable))
            output.write(str(self.identifiers_table.symboltable))
            
        with open('PIF.out', 'w') as output:
            for key, value in self.pif:
                output.write(f"{key} - {value}\n")

    def get_tokens(self):
        should_add_in = TokenTypes.RESERVED_WORD
        line_no = -1
        with open(self.token_file, 'r') as token_file:
            for line in token_file:
                line = line.replace('\n', '')
                
                line_no += 1

                if line == '[reserved_words]':
                    continue
                
                if line == '[operators]':
                    should_add_in = TokenTypes.OPERATOR
                    continue
                
                if line == '[separators]':
                    should_add_in = TokenTypes.SEPARATOR
                    continue
                
                if should_add_in == TokenTypes.RESERVED_WORD:
                    self.reserved_words[line]= line_no
                    
                if should_add_in == TokenTypes.OPERATOR:
                    self.operators[line]= line_no
                    
                if should_add_in == TokenTypes.SEPARATOR:
                    self.separators[line]= line_no

    def is_identifier(self, string):
        return self.finite_automata.check_word_if_identifier(string)
    
    def is_constant(self, string):
        pattern_char = re.compile("'[a-zA-Z0-9]'")
        pattern_string = re.compile('"[a-zA-Z0-9]*"')
        if self.finite_automata.check_word_if_integer_constant(string) or pattern_char.fullmatch(string) or pattern_string.fullmatch(string):
            return True
        return False
