package Model.Types;

import Model.Values.Value;
import Model.Values.IntValue;

public class IntType implements Type{
    @Override
    public Type deepCopy(){
        return new IntType();
    }

    @Override
    public boolean equals(Object o){ return o instanceof IntType; }
    @Override
    public Value getDefault() {
        return new IntValue(0);
    }

    @Override
    public String toString(){ return "int"; }
}
