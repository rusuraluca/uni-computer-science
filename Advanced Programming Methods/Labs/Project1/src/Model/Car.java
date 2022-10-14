package Model;

public class Car implements Vehicle {
    public enum Model {
        sedan,
        coupe,
        hatchback,
        wagon,
        crossover,
        minivan,
        SUV
    }
    private Model model;
    private String brand;
    private Color color;
    private int seats;

    public Car(Model model, String brand, Color color, int seats) {
        this.model = model;
        this.color = color;
        this.brand = brand;
        this.seats = seats;
    }

    public Model getModel() {
        return model;
    }

    public String getBrand() { return brand; }

    @Override
    public Color getColor() {
        return color;
    }

    public int getSeats() {
        return seats;
    }

    @Override
    public String toString() {
        return "Car        - Model: " + model + " | Brand: " + brand + " | Seats: " + seats + " | Color: " + color;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Car)) return false;

        Car car = (Car) o;
        return model.equals(car.model) && brand.equals(car.brand) && color.equals(car.color);
    }
}
