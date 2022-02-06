def age():
    """
        Computes the age of the person in number of years.

        Solution
            I found the age by subtracting birth year from current year.
            Along with this, we need to focus on the birth month and birthday.
            For this, we check if current month and date are less than birth month and date.
            If yes subtract 1 from age, otherwise 0.

        Input
            Three integers representing the current date (day, month, year).
            Three integers representing the person birthdate (birth_day, birth_month, birth_year).
        Output
            An integer representing the age of the person in years.
    """

    current_age = year - birth_year
    if month < birth_month:
        if day < birth_day:
            current_age = current_age - 1

    return current_age


day = int(input("day="))
month = int(input("month="))
year = int(input("year="))
birth_day = int(input("birth_day="))
birth_month = int(input("birth_month="))
birth_year = int(input("birth_year="))
print(age())

