package Model.Values;

import Model.Types.IType;
import Model.Types.StringType;

/**
 * Class for String values
 */
public class StringValue implements IValue {
    private final String value;

    public StringValue(String value) {
        this.value = value;
    }

    public String getValue() {
        return this.value;
    }

    @Override
    public IType getType() {
        return new StringType();
    }

    @Override
    public boolean equals(Object another) {
        if (another instanceof StringValue) {
            StringValue anotherStringValue = (StringValue) another;
            return this.value.equals(anotherStringValue.value);
        }
        return false;
    }

    @Override
    public String toString() {
        return "\"" + this.value + "\"";
    }

}

