package Controller;

import Model.Vehicle;
import Repository.Repository;
import Exceptions.InnexistentVehicleException;
import Exceptions.ParkingLotFullException;

public class Controller {
    Repository r;

    public Controller(Repository r) {
        this.r = r;
    }

    public void add(Vehicle v) throws ParkingLotFullException {
        this.r.add(v);
    }

    public void remove(Vehicle v) throws InnexistentVehicleException {
        this.r.remove(v);
    }

    public Vehicle[] solve() {
        int cnt = 0;
        for(Vehicle v : this.r.getAll())
            if(v != null && v.getColor() == Vehicle.Color.red) {
                ++ cnt;
            }

        Vehicle[] arr = new Vehicle[cnt];

        cnt = 0;
        for(Vehicle v: this.r.getAll())
            if(v != null && v.getColor() == Vehicle.Color.red)
                arr[cnt ++] = v;
        return arr;
    }
}
