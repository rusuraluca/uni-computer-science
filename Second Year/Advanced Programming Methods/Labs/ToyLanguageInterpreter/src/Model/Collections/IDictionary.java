package Model.Collections;

import Exceptions.CollectionsException;

import java.util.Collection;
import java.util.Map;
import java.util.Set;

public interface IDictionary<T1, T2> {
    void put(T1 key, T2 value);
    boolean containsKey(T1 key);
    T2 lookUp(T1 key) throws CollectionsException;
    void update(T1 key, T2 value) throws CollectionsException;
    Collection<T2> values();
    void remove(T1 key) throws CollectionsException;;
    Set<T1> keySet();
    Map<T1, T2> getContent();
    T2 get(T1 key);
    IDictionary<T1, T2> copy();
}
