package Model.Collections;


import Exceptions.InterpreterException;

import java.util.List;

public interface IList<T> {
    void add(T elem);
    T pop() throws InterpreterException;
    boolean isEmpty();
    List<T> getList();
}