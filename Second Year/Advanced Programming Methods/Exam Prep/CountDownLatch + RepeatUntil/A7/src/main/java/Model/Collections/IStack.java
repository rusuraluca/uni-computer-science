package Model.Collections;


import Exceptions.InterpreterException;

import java.util.List;

public interface IStack<T> {
    T pop() throws InterpreterException;
    void push(T element);
    T peek();
    boolean isEmpty();
    List<T> getReversed();
}