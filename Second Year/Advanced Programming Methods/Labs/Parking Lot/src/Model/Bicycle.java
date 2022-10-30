package Model;

public class Bicycle implements Vehicle {
    public enum Type {
        road,
        mountain,
        commuter,
        bmx
    }
    private Type type;
    private String brand;
    private Color color;
    private double wheelSize;

    public Bicycle(Type type, String brand, Color color, double wheelSize) {
        this.type = type;
        this.color = color;
        this.brand = brand;
        this.wheelSize = wheelSize;
    }

    public Type getType() {
        return type;
    }

    public String getBrand() {
        return brand;
    }

    @Override
    public Color getColor() {
        return color;
    }

    public double getWheelSize() {
        return wheelSize;
    }

    @Override
    public String toString() {
        return "Bicycle    - Type: " + type + " | Brand: " + brand + " | Wheel Size: " + wheelSize + " | Color: " + color;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Car)) return false;

        Bicycle bicycle = (Bicycle) o;
        return type.equals(bicycle.type) && brand.equals(bicycle.brand) && color.equals(bicycle.color);
    }
}
