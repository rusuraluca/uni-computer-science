package Model.Values;

import Model.Types.Type;
import Model.Types.BoolType;

public class BoolValue implements Value {
    private boolean value;

    public BoolValue(boolean value){ this.value = value; }

    public boolean getValue() { return this.value; }

    public void setValue(boolean value) { this.value = value; }

    @Override
    public Value deepCopy(){
        return new BoolValue(value);
    }

    @Override
    public Type getType() { return new BoolType(); }

    @Override
    public String toString() { return this.value ? "true" : "false"; }

    @Override
    public boolean equals(Object obj){
        if (!(obj instanceof BoolValue castObj))
            return false;

        return this.value == castObj.value;
    }
}
