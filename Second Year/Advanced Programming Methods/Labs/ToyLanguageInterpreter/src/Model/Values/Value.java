package Model.Values;

import Model.Types.BoolType;
import Model.Types.Type;

public interface Value {
    Value deepCopy();
    Type getType();
}
