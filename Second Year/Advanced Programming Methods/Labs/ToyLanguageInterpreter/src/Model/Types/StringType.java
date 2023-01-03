package Model.Types;

import Model.Values.StringValue;
import Model.Values.IValue;

/**
 * Class for String types
 */
public class StringType implements IType {
    @Override
    public IValue defaultValue() {
        return new StringValue("");
    }

    @Override
    public boolean equals(IType another) {
        if (another instanceof StringType)
            return true;

        return false;
    }

    @Override
    public String toString() {
        return "string";
    }
}
