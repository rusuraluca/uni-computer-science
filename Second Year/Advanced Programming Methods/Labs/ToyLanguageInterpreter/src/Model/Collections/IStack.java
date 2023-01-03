package Model.Collections;

import Exceptions.CollectionsException;

import java.util.List;

public interface IStack<T> {
    T pop() throws CollectionsException;
    void push(T v);
    boolean isEmpty();

    List<T> getReversed();
}
