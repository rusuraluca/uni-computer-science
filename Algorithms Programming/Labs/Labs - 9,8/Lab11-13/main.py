from ui.console import start
from application.airport_controller import AirportController
from domain.passenger import Passenger
from domain.plane import Plane
from infrastructure.airport import Airport


if __name__ == "__main__":
    controller = AirportController(
        Airport([
            Plane("BA1", "BestAir", 30, "Ibiza", [
                Passenger("Jake", "Garcia", "JG003"),
                Passenger("John", "Mayer", "JM553"),
                Passenger("Robert", "Smith", "RS229"),
                Passenger("Jake", "Garcia", "JG053"),
            ]),
            Plane("BA2", "BestAir", 25, "Cluj", [
                Passenger("Maddie", "Reynolds", "MR101"),
                Passenger("Brett", "White", "BW111"),
                Passenger("Robert", "Smith", "RS229")
            ]),
            Plane("NA36", "NextAir", 36, "Cluj", [
                Passenger("Jake", "Garcia", "JG003"),
                Passenger("Oliver", "Brown", "OB820"),
                Passenger("William", "Anderson", "WA456")
            ]),

            Plane("NA20", "NextAir", 20, "Brazil", [
                Passenger("Oliver", "Brown", "OB820"),
                Passenger("William", "Anderson", "WA456")
            ]),

            Plane("BW15", "BlueWave", 15, "Cluj", [
                Passenger("Aaron", "Hank", "AH952"),
                Passenger("Abigail", "Douglas", "AD111")
            ]),

            Plane("MA21", "MaxAir", 21, "Roma", [
                Passenger("Alexandra", "Hatfield", "AH333"),
                Passenger("Brett", "White", "BW111")
            ]),

            Plane("BW30", "BlueWave", 30, "Brazil", [
                Passenger("Alexandra", "Hatfield", "AH333"),
                Passenger("Marian", "Jackson", "MJ872"),
                Passenger("Brett", "White", "BW111"),
                Passenger("Jake", "Garcia", "JG003")
            ]),

            Plane("BW23", "BlueWave", 23, "Roma", [
                Passenger("John", "Foster", "JF333"),
                Passenger("Elizabeth", "Ansel", "EA872"),
                Passenger("George", "Ansel", "GA111"),
                Passenger("Whitman", "Walt", "WW345")
            ]),

            Plane("TA01", "Tacom", 35, "Cluj", [
                Passenger("Paul", "Pop", "PP123"),
                Passenger("Alex", "Bob", "AB123"),
                Passenger("Robert", "Crainic", "RC123"),
                Passenger("Dan", "Cantor", "DC123"),
                Passenger("Vlad", "Oprea", "VO123"),
                Passenger("George", "Ansel", "GA111"),
                Passenger("Alexandra", "Hatfield", "AH333")
            ]),

            Plane("TA02", "Tacom", 25, "Roma", [
                Passenger("Paul", "Pop", "PP123"),
                Passenger("Roberta", "Kerekes", "RK003"),
                Passenger("Alexandru", "Stezar", "AS003")
            ]),
        ]))
    start(controller)
