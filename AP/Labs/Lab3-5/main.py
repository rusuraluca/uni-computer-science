"""
This is the module for starting the application.
"""

from ui.console import start
from tests.run import all_tests

all_tests()

print("All tests passed!\n")

start()
