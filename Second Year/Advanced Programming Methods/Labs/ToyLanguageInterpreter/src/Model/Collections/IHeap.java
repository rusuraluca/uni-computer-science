package Model.Collections;

import Exceptions.CollectionsException;
import Model.Values.IValue;

import java.util.HashMap;
import java.util.Set;

public interface IHeap {
    int getFreeValue();
    HashMap<Integer, IValue> getContent();
    void setContent(HashMap<Integer, IValue> newMap);
    int add(IValue value);
    void update(Integer position, IValue value) throws CollectionsException;
    IValue get(Integer position) throws CollectionsException;
    boolean containsKey(Integer position);
    void remove(Integer key) throws CollectionsException;
    Set<Integer> keySet();
}
