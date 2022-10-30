package Model;

public class Motorcycle implements Vehicle {
    public enum Category {
        sport,
        dualsport,
        cross,
        adventure,
        cruiser,
        touring
    }
    private Category category;
    private String brand;
    private Color color;
    private double maxSpeed;

    public Motorcycle(Category category, String brand, Color color, double maxSpeed) {
        this.category = category;
        this.brand = brand;
        this.color = color;
        this.maxSpeed = maxSpeed;
    }

    public Category getCategory() {
        return category;
    }

    public String getBrand() {
        return brand;
    }

    @Override
    public Color getColor() {
        return color;
    }

    public double getMaxSpeed() { return maxSpeed; }

    @Override
    public String toString() {
        return "Motorcycle - Category: " + category + " | Brand: " + brand + " | MaxSpeed: " + maxSpeed + " | Color: " + color;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Motorcycle)) return false;

        Motorcycle motorcycle = (Motorcycle) o;
        return category.equals(motorcycle.category) && brand.equals(motorcycle.brand) && color.equals(motorcycle.color);
    }
}
