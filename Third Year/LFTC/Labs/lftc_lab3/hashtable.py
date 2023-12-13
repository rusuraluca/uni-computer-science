import copy


class Node:
    """ class Node for storing key-value pairs in the hash table

    Attributes:
        key: key of the pair
        value : value of the pair
        next: pointer to the next node (used for handling collisions in the hash table)
    """
    def __init__(self, key, value):
        self.key = key
        self.value = value
        self.next = None


class HashTable:
    """ class HashTable for storing key-value pairs in the hash table
    
    Attributes:
        capacity: current capacity of the hash table
        elmnt_no: number of elements (key-value pairs) in the hash table
        elmnt_list: list used to store elements, with each index potentially holding a linked list of Node objects
        
    Methods:
        __init__:
            - we initialize a hash table and set the capacity initially to 10, elmnt_no is 0 and elmnt_list is formed of 10 positions of None
            
        __str__:
            - returns a string representation of the hash table
            
        hash(value):
            - calculates the hash code for a given value (key)
                - if the value is an integer, it calculates the hash code as the remainder of the integer when divided by the current capacity
                - if the value is a string, it calculates the hash code as the sum of the ASCII values of its characters, divided by the current capacity
                
        insert(key, value) 
            - to insert a key-value pair into the hash table
                - if the load factor (ratio of elements to capacity) is greater than or equal to 2, it triggers a resize and rehash operation
                - it calculates the hash for the key and inserts the new Node into the appropriate position in the linked list at that index
                
        get(key) 
            - retrieves the value associated with a given key
            - it calculates the hash for the key, searches the linked list at that index, and returns the value if the key is found, if not found, it returns None

        resize_and_rehash() 
            - called when the load factor exceeds 2
                - doubles the hash table capacity
                - it creates a deep copy of the existing element list, resets the element list with the new capacity, and reinserts the elements using the insert method
                
        get_position(key):
            - returns the index of the list where the key-value pair with the given key is stored
    """
    def __init__(self):
        self.capacity = 10
        self.elmnt_no = 0
        self.elmnt_list = [None] * 10
    
    def hash(self, value):
        if isinstance(value, int):
            return value % self.capacity
        
        sum = 0
        for l in value:
            sum += ord(l)
        return sum % self.capacity

    def insert(self, key, value):
        if self.elmnt_no and (self.capacity // self.elmnt_no < 2):
            self.resize_and_rehash()
            
        elmnt = self.elmnt_list[self.hash(key)]
        
        if elmnt is None:
            self.elmnt_list[self.hash(key)] = Node(key, value)
            self.elmnt_no += 1
            return
        
        while elmnt.next is not None:
            elmnt = elmnt.next
        elmnt.next = Node(key, value)
        self.elmnt_no += 1
        
    def get(self, key):
        elmnt = self.elmnt_list[self.hash(key)]
        while elmnt is not None:
            if elmnt.key == key:
                return elmnt.value
            elmnt = elmnt.next
        return None
    
    def get_position(self, key):
        elmnt = self.elmnt_list[self.hash(key)]
        position = 0
        while elmnt is not None:
            if elmnt.key == key:
                return self.hash(key), position
            elmnt = elmnt.next
            position = position + 1
        return None
    
    def resize_and_rehash(self):
        self.capacity *= 2
        
        copy_elmnt_list = copy.deepcopy(self.elmnt_list)
        self.elmnt_list = [None] * self.capacity
        self.elmnt_no = 0
        for elmnt in copy_elmnt_list:
            copy_elmnt = copy.deepcopy(elmnt)
            while copy_elmnt is not None:
                self.insert(copy_elmnt.key, copy_elmnt.value)
                copy_elmnt = copy_elmnt.next

    def __str__(self):
        string_builder = ""
        for elmnt in self.elmnt_list:
            while elmnt is not None:
                string_builder += f"{elmnt.key} - {self.get_position(elmnt.key)} \n"
                elmnt = elmnt.next
        return string_builder
