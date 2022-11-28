package Model.Values;

import Model.Types.Type;
import Model.Types.StringType;

public class StringValue implements Value {
    private String string;

    public StringValue(String string){ this.string = string; }

    public String getValue() { return string; }

    public void setValue(String string) { this.string = string; }

    @Override
    public Value deepCopy(){
        return new StringValue(string);
    }

    @Override
    public Type getType() { return new StringType(); }

    @Override
    public String toString() { return String.format("%s", string); }

    @Override
    public boolean equals(Object obj){
        if (!(obj instanceof StringValue castObj))
            return false;

        return this.string.equals(castObj.string);
    }
}
