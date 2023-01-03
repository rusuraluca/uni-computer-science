package Model.Collections;

import Exceptions.CollectionsException;

import java.util.List;

public interface IList<T> {
    void add(T e);
    String toString();
    T pop() throws CollectionsException;
    boolean isEmpty();
    List<T> getList();
}
