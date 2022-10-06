from utils.functions import *


class BookRepository:

    # Constructor

    def __init__(self):
        """
        This is the initializing method or constructor for the class.
        Creates a new collection with Book instances.
        :return:
        """
        self.__repo = []

    def len(self):
        return len(self.__repo)

    def __str__(self):
        """
        This function provides the string representation of the repository.
        :return:
        """
        if len(self.__repo) == 0:
            raise Exception("No books in the repository! Add some first!")

        string = "Bookstore database: \n"
        for elem in self.__repo:
            string += (str(elem))
            string += "\n"
        return string

    def exists_object(self, title):
        """
        Checks if a book is in the repository.
        :param title: string representing the title with which we find the book we want to check for
        :return: boolean - true if object in repository, false otherwise
        """
        for elem in self.__repo:
            if elem.get_title() == title:
                return True
        return False

    def add(self, book):
        """
        Add a book to the repository.
        :param book: Book object
        :return:
        """
        try:
            if self.exists_object(book.get_title()):
                raise Exception("Error: the book is already in the bookstore database!")
            else:
                self.__repo.append(book)
        except Exception as ex:
            print(ex)

    def discount(self):
        """
        Get the first three books with the lowest number of items sold with a 10% discount.
        :return: list of the three asked books with discount applied
        """
        # sort in ascending order
        sort(self.__repo, lambda x, y: x.get_number() > y.get_number())

        # get the first three books
        list = []
        i = 0
        while i <= 2:
            # apply discount
            self.__repo[i].set_price(int(self.__repo[i].get_price()) - (int(self.__repo[i].get_price()) % 10))
            list.append(self.__repo[i])
            i += 1

        return list

    def sort_price_tag(self, price):
        """
        Sort descending by the number of items sold the books of price tag given
        :param price: float representing the price tag
        :return: list of the books asked sorted
        """
        list = []
        for book in self.__repo:
            if book.get_price() == price:
                list.append(book)

        # sort in descending order
        sort(list, lambda x, y: x.get_number() < y.get_number())
        return list
