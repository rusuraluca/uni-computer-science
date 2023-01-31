package Model.Collections;

import Exceptions.InterpreterException;
import javafx.util.Pair;

import java.util.List;

public class MySemaphoreTable extends MyDictionary<Integer, Pair<Integer, Pair<List<Integer>, Integer>>> implements ISemaphoreTable {
    private int nextFreeLocation;

    public MySemaphoreTable() {
        super();
        this.nextFreeLocation = 1;
    }
    public void put(Integer key, Pair<Integer, Pair<List<Integer>, Integer>> value) throws InterpreterException {
        if (!key.equals(nextFreeLocation))
            throw new InterpreterException("Invalid semaphore table location!");
        super.put(key, value);
        synchronized (this) {
            nextFreeLocation++;
        }
    }

    @Override
    public int put(Pair<Integer, Pair<List<Integer>, Integer>> value) throws InterpreterException {
        super.put(nextFreeLocation, value);
        synchronized (this) {
            nextFreeLocation++;
        }
        return nextFreeLocation - 1;
    }

    @Override
    public int getFirstFreeLocation() {
        int locationAddress = 1;
        while (this.dictionary.get(locationAddress) != null)
            locationAddress++;
        return locationAddress;
    }
}
