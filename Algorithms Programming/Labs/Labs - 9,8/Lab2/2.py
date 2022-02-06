def date_of_the_year(year, days):
    """
        Determines a date (as day, month, year)
        starting from two integer numbers that represent
        the year and the number of the day in that year.

        Input
            Two integers (year, days) representing the year and the number of the day
        Output
            The required date
    """
    month = 1

    while days-30 > 0:
        days = days - 30
        month = month + 1

    print("%s.%s.%s" % (days, month, year))


year = int(input("year="))
days = int(input("day="))
date_of_the_year(year, days)
