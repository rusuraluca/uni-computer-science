package Model.Values;

import Model.Types.Type;

public interface Value {
    Type getType();
    Value deepCopy();
}