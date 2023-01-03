package Model.Types;

import Model.Values.BoolValue;
import Model.Values.IValue;

/**
 * Class for Boolean types
 */
public class BoolType implements IType {
    @Override
    public IValue defaultValue() {
        return new BoolValue(false);
    }

    @Override
    public boolean equals(IType another) {
        if (another instanceof BoolType)
            return true;

        return false;
    }

    @Override
    public String toString() {
        return "boolean";
    }
}
