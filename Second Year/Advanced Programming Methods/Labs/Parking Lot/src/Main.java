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
        System.out.println("Welcome to our parking!\n");

        Repository r = new InMemoryRepository();
        Controller ctrl = new Controller(r);
        Vehicle vr = new Motorcycle(Motorcycle.Category.cross, "Kawasaki", Vehicle.Color.red, 280);
        try {
            r.add(new Bicycle(Bicycle.Type.bmx, "XBikes", Vehicle.Color.red, 10.5));
            r.add(new Car(Car.Model.sedan, "BMX", Vehicle.Color.red, 5));
            r.add(new Motorcycle(Motorcycle.Category.adventure, "Yamaha", Vehicle.Color.red, 200));
            r.add(new Bicycle(Bicycle.Type.road, "YBikes", Vehicle.Color.black, 12));
            r.add(new Car(Car.Model.SUV, "Tesla", Vehicle.Color.white, 5));
            r.add(new Motorcycle(Motorcycle.Category.cruiser, "Suzuki", Vehicle.Color.green, 250));
            r.add(new Bicycle(Bicycle.Type.mountain, "ZBikes", Vehicle.Color.red, 13.5));
            r.add(new Car(Car.Model.minivan, "Opel", Vehicle.Color.green, 8));
            r.add(new Motorcycle(Motorcycle.Category.sport, "Honda", Vehicle.Color.green, 280));
            r.add(vr);
            // trying to add a new vehicle when the parking lot is full will throw exception
            r.add(new Bicycle(Bicycle.Type.commuter, "ABikes", Vehicle.Color.red, 16));
        } catch (ParkingLotFullException exception) {
            System.out.println(exception);
            System.out.println('\n');
        }


        UI ui = new UI(ctrl);
        ui.show();
        System.out.println('\n');

        try {
            ctrl.remove(vr);
            // trying to remove a non-existent vehicle from the parking lot will throw exception
            ctrl.remove(new Bicycle(Bicycle.Type.road, "YBikes", Vehicle.Color.red, 15.5));
        } catch (InnexistentVehicleException exception) {
            System.out.println(exception);
            System.out.println('\n');
        }

        ui.show();
    }
}