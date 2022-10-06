import unittest

if __name__ == "__main__":
    """
    This is how I can run all of the tests at once. I loaded them with a `TestLoader` (class in `unittest`). 
    For the `discover` method I passed:
        - directory: where to look for the files containing the test classes 
        (in my case `tests` directory in the current - '.' - folder) 
        - pattern (optional argument): a pattern that matches the test files' name 
        (in my case it has to start with 'test_' and it has the finish with '.py')
    """
    loader = unittest.TestLoader()
    suite = loader.discover("./tests", pattern="test_*.py")
    unittest.TextTestRunner().run(suite)

    # or run in the console the following command
    # python -m unittest discover -s tests -p 'test_*.py'
