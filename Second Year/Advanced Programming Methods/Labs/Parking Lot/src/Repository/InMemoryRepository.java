package Repository;

import Model.Vehicle;
import Exceptions.ParkingLotFullException;
import Exceptions.InnexistentVehicleException;

public class InMemoryRepository implements Repository {
    int capacity;
    int size;
    Vehicle[] parking;

    public InMemoryRepository() {
        capacity = 10;
        size = 0;
        parking = new Vehicle[10];
    }

    public InMemoryRepository(Vehicle[] parking) {
        this.parking = parking;
        this.size = parking.length;
        this.capacity = (int) Math.ceil(Math.pow(2, Math.ceil(Math.log(this.size))));
    }

    @Override
    public void add(Vehicle v) throws ParkingLotFullException {
        if (size == capacity){
            throw new ParkingLotFullException();
        }
        parking[size] = v;
        ++size;
    }

    @Override
    public boolean find(Vehicle v) {
        for(int i = 0; i < size; ++ i)
            if(parking[i].equals(v))
                return true;
        return false;
    }

    @Override
    public void remove(Vehicle v) throws InnexistentVehicleException {
        Vehicle[] filter = new Vehicle[capacity];
        int filterSize = 0;
        for (int i = 0; i < size; ++i)
            if (!parking[i].equals(v)) {
                filter[filterSize++] = parking[i];
            }
        if(filterSize == size) {
            throw new InnexistentVehicleException();
        }
        size = filterSize;
        parking = filter;
    }

    @Override
    public Vehicle[] getAll() {
        return parking;
    }
}
