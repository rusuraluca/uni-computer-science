package Model.Types;

import Model.Values.Value;

public interface Type {
    Type deepCopy();
    Value getDefault();
}
