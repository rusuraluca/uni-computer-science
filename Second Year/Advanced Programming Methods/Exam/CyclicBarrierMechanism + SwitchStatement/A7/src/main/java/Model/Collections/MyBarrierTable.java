package Model.Collections;

import Exceptions.InterpreterException;
import javafx.util.Pair;
import java.util.List;

public class MyBarrierTable extends MyDictionary<Integer, Pair<Integer, List<Integer>>> implements IBarrierTable {
    private int nextFreeLocation;

    public MyBarrierTable() {
        super();
        this.nextFreeLocation = 1;
    }

    @Override
    public void put(Integer key, Pair<Integer, List<Integer>> value) throws InterpreterException {
        if (!key.equals(nextFreeLocation))
            throw new InterpreterException("Invalid lock table location!");
        super.put(key, value);
        synchronized (this) {
            nextFreeLocation++;
        }
    }

    @Override
    public int put(Pair<Integer, List<Integer>> value) throws InterpreterException {
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
