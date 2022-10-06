from domain.book import Book
from infrastructure.book_repository import BookRepository

repository = BookRepository()

book1 = Book("Alba ca zapada", 25.5, 20)
book2 = Book("Moartea caprioarei", 15.75, 15)
book3 = Book("Baltagul", 20, 55)
book4 = Book("Ion", 18, 67)
book5 = Book("Moara cu noroc", 25, 45)

repository.add(book1)
repository.add(book2)
repository.add(book3)
repository.add(book4)
repository.add(book5)
print(repository)


print('----------------------\n')
print('----------------------\n')


print("1. Add a book to the repository:\n")
print("If book not in repository:")
book_test = Book("Enigma Otiliei", 20, 50)
repository.add(book_test)
print("Book Added!\n")

print("If book in the repository:")
book_error = Book("Enigma Otiliei", 20, 50)
repository.add(book_error)
print("\n")

print(repository)


print('----------------------\n')
print('----------------------\n')


print("2. First three books with the lowest number of items sold with a 10% discount:")
books = repository.discount()
for book in books:
    print(book)
print("\n")
print(repository)


print('----------------------\n')
print('----------------------\n')


print("3. Sort descending by the number of items sold the books of pricetag given: 20")

books = repository.sort_price_tag(20)
for book in books:
    print(book)
print("\n")
print(repository)


print('----------------------\n')
print('----------------------\n')
