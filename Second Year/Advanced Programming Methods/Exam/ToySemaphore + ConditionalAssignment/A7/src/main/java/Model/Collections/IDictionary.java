package Model.Collections;


import Exceptions.InterpreterException;

import java.util.Collection;
import java.util.Map;
import java.util.Set;

public interface IDictionary<T1,T2> {
    boolean isDefined(T1 key);
    void put(T1 key, T2 value) throws InterpreterException;
    T2 lookUp(T1 key) throws InterpreterException;
    void update(T1 key, T2 value) throws InterpreterException;
    Collection<T2> values();
    void remove(T1 key) throws InterpreterException;
    Set<T1> keySet();
    Map<T1, T2> getContent();
    IDictionary<T1, T2> deepCopy() throws InterpreterException;
}