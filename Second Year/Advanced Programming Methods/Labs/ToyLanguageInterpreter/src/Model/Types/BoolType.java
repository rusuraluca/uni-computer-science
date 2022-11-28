package Model.Types;

import Model.Values.Value;
import Model.Values.BoolValue;

public class BoolType implements Type{
    @Override
    public Type deepCopy(){
        return new BoolType();
    }

    @Override
    public boolean equals(Object o){ return o instanceof BoolType; }

    @Override
    public Value getDefault() { return new BoolValue(false); }

    @Override
    public String toString(){ return "bool"; }
}