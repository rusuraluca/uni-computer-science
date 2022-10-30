package Repository;

import Model.Vehicle;
import Exceptions.ParkingLotFullException;
import Exceptions.InnexistentVehicleException;

public interface Repository {
    void add(Vehicle v) throws ParkingLotFullException;
    void remove(Vehicle v) throws InnexistentVehicleException;
    boolean find(Vehicle v);
    Vehicle[] getAll();
}
