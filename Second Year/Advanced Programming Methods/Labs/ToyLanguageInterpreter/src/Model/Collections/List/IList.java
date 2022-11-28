package Model.Collections.List;

import java.util.List;

public interface IList<T> {
    void add(T e);
    int size();
    T get(int idx);
    void clear();
    boolean contains(T e);
    boolean isEmpty();
    String toString();
}
