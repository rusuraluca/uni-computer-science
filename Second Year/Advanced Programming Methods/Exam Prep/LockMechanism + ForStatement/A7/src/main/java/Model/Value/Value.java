package Model.Value;

import Model.Types.Type;

public interface Value {
    Type getType();
    Value deepCopy();
}