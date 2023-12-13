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
