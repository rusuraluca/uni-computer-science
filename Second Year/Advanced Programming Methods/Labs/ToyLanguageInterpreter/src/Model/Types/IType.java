package Model.Types;

import Model.Values.IValue;

/**
 * Interface for all types
 */
public interface IType {
    IValue defaultValue();
    boolean equals(IType another);
    String toString();
}
