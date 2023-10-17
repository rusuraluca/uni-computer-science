import copy


class Node:
    def __init__(self, key, value):
        self.key = key
        self.value = value
        self.next = None


class HashTable:
    def __init__(self):
        self.capacity = 2
        self.elmnt_no = 0
        self.elmnt_list = [None] * 2
    
    def hash(self, value):
        if isinstance(value, int):
            return value % self.capacity
        sum = 0
        for letter in value:
            sum += ord(letter)
        return sum % self.capacity

    def insert(self, key, value):
        if self.elmnt_no != 0 and self.capacity:
            self.resize_and_rehash()
            
        node = self.elmnt_list[self.hash(key)]
        
        if node is None:
            self.elmnt_list[self.hash(key)] = Node(key, value)
            self.elmnt_no += 1
            return
        
        while node.next is not None:
            node = node.next
        node.next = Node(key, value)
        self.elmnt_no += 1
        
    def get(self, key):
        node = self.elmnt_list[self.hash(key)]
        while node is not None:
            if node.key == key:
                return node.value
            node = node.next
        return None
    
    def resize_and_rehash(self):
        self.capacity *= 2
        copy_list = copy.deepcopy(self.elmnt_list)
        self.elmnt_list = [None] * self.capacity
        self.elmnt_no = 0
        for node in copy_list:
            copy_node = copy.deepcopy(node)
            while copy_node is not None:
                self.insert(copy_node.key, copy_node.value)
                copy_node = copy_node.next