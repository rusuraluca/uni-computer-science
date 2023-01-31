package Model.Collections;

import Exceptions.InterpreterException;

public class MyLatchTable extends MyDictionary<Integer, Integer> implements ILatchTable{
    private int nextFreeLocation;

    public MyLatchTable() {
        super();
        this.nextFreeLocation = 1;
    }

    @Override
    public void put(Integer key, Integer value) throws InterpreterException {
        if (!key.equals(nextFreeLocation))
            throw new InterpreterException("Invalid lock table location!");
        super.put(key, value);
        synchronized (this) {
            nextFreeLocation++;
        }
    }

    @Override
    public int put(Integer value) throws InterpreterException {
        super.put(nextFreeLocation, value);
        synchronized (this) {
            nextFreeLocation++;
        }
        return nextFreeLocation-1;
    }

    @Override
    public int get(int position) throws InterpreterException {
        synchronized (this) {
            if (!this.dictionary.containsKey(position))
                throw new InterpreterException(String.format("%d is not present in the table!", position));
            return this.dictionary.get(position);
        }
    }

    @Override
    public int getFirstFreeLocation(){
        int locationAddress = 1;
        while (this.dictionary.get(locationAddress) != null)
            locationAddress++;
        return locationAddress;
    }
}
