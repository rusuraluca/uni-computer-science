package Model.Collections;

import Exceptions.InterpreterException;

public interface ILatchTable  extends IDictionary<Integer, Integer> {
    int put(Integer value) throws InterpreterException;
    int get(int position) throws InterpreterException;
    int getFirstFreeLocation();
}
