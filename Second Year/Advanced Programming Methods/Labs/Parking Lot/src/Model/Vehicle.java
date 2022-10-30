package Model;

public interface Vehicle {
    enum Color {
        red,
        white,
        black,
        blue,
        green
    }
    Color getColor();
}

