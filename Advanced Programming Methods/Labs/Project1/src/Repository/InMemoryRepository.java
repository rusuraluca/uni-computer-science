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

        /* dynamic way
        parking[size] = v;
        ++size;
        if (size == capacity) {
            capacity *= 2;
            Vehicle[] newArr = new Vehicle[capacity];
            for (int i = 0; i < size; ++i) {
                newArr[i] = parking[i];
            }
            parking = newArr;
        }
        */
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
        int currSize = 0;
        for (int i = 0; i < size; ++i)
            if (!parking[i].equals(v)) {
                filter[currSize++] = parking[i];
            }
        if(currSize == size) {
            throw new InnexistentVehicleException();
        }
        size = currSize;
        parking = filter;
    }

    @Override
    public Vehicle[] getAll() {
        return parking;
    }
}
