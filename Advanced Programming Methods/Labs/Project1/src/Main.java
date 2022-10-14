import Model.Vehicle;
import Model.Car;
import Model.Bicycle;
import Model.Motorcycle;
import Repository.Repository;
import Repository.InMemoryRepository;
import Exceptions.ParkingLotFullException;
import Exceptions.InnexistentVehicleException;
import Controller.Controller;
import View.UI;

public class Main {
    public static void main(String[] args) {
        System.out.println("Welcome to Parking 2222!");

        Repository r = new InMemoryRepository();
        try {
            r.add(new Bicycle(Bicycle.Type.bmx, "XBikes", Vehicle.Color.red, 10.5));
            r.add(new Car(Car.Model.sedan, "Tesla", Vehicle.Color.blue, 5));
            r.add(new Motorcycle(Motorcycle.Category.adventure, "Yamaha", Vehicle.Color.red, 200.5));
        } catch (ParkingLotFullException exception) {
            System.out.println(exception);
        }

        Controller ctrl = new Controller(r);
        UI ui = new UI(ctrl);
        ui.show();
    }
}