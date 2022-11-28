package Model.Types;

import Model.Values.Value;
import Model.Values.StringValue;

public class StringType implements Type{
    @Override
    public Type deepCopy(){
        return new StringType();
    }

    @Override
    public boolean equals(Object o){ return o instanceof StringType; }

    @Override
    public Value getDefault() { return new StringValue(""); }

    @Override
    public String toString(){ return "string"; }
}