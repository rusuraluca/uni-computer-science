package Model.Collections;

import Exceptions.CollectionsException;

import java.util.Collection;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

public class MyDictionary<T1, T2> implements IDictionary<T1, T2> {
    HashMap<T1, T2> dict;

    public MyDictionary() {
        this.dict = new HashMap<>();
    }

    @Override
    public void put(T1 key, T2 value) {
        this.dict.put(key, value);
    }

    @Override
    public boolean containsKey(T1 key) {
        return this.dict.containsKey(key);
    }

    @Override
    public T2 lookUp(T1 key) throws CollectionsException {
        // get the value associated with the key
        if (!containsKey(key))
            throw new CollectionsException(key + " is not defined.");

        return this.dict.get(key);
    }

    @Override
    public void update(T1 key, T2 value) throws CollectionsException {
        // update the value associated with the key
        if (!containsKey(key))
            throw new CollectionsException(key + " is not defined.");

        this.dict.put(key, value);
    }

    @Override
    public Collection<T2> values() {
        // get all the values from the dictionary (values are not unique)
        return this.dict.values();
    }

    @Override
    public void remove(T1 key) throws CollectionsException {
        // remove the element associated with the key
        if (!containsKey(key))
            throw new CollectionsException(key + " is not defined.");

        this.dict.remove(key);
    }

    @Override
    public Set<T1> keySet() {
        return dict.keySet();
    }

    @Override
    public String toString() {
        return this.dict.toString();
    }

    @Override
    public Map<T1, T2> getContent() {
        return this.dict;
    }

    @Override
    public T2 get(T1 key){
        return dict.get(key);
    }

    @Override
    public IDictionary<T1, T2> copy() {
        IDictionary<T1, T2> toReturn = new MyDictionary<>();
        for (T1 key : keySet())
            toReturn.put(key, get(key));
        return toReturn;
    }
}
