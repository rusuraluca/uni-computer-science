package Model.Values;

import Model.Types.Type;
import Model.Types.IntType;

public class IntValue implements Value {
    private int value;

    public IntValue(int value){ this.value = value; }

    public int getValue() { return value; }

    public void setValue(int value) { this.value = value; }

    @Override
    public Value deepCopy(){
        return new IntValue(value);
    }

    @Override
    public Type getType() { return new IntType(); }

    @Override
    public String toString() { return String.format("%d", value); }

    @Override
    public boolean equals(Object obj){
        if (!(obj instanceof IntValue castObj))
            return false;

        return this.value == castObj.value;
    }
}
