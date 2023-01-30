package Model.Types;

import Model.Value.Value;

public interface Type {
    boolean equals(Type anotherType);
    Value defaultValue();
    Type deepCopy();
}