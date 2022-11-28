package Model.Collections.Dictionary;

import java.util.*;


public class MyDictionary<K, V> implements IDictionary<K, V> {
    HashMap<K, V> dic;

    public MyDictionary(){ dic = new HashMap<>(); }

    @Override
    public void put(K key, V value){
        dic.put(key, value);
    }

    @Override
    public V get(K key){
        return dic.get(key);
    }

    @Override
    public boolean containsKey(K id) {
        return dic.containsKey(id);
    }


    public Set<K> keySet(){
        return dic.keySet();
    }

    @Override
    public void remove(K key) {
        dic.remove(key);
    }

    @Override
    public Map<K, V> getContent() {
        return dic;
    }

    @Override
    public IDictionary<K, V> copy() {
        IDictionary<K, V> toReturn = new MyDictionary<>();
        for (K key : keySet())
            toReturn.put(key, get(key));
        return toReturn;
    }

    @Override
    public String toString(){
        return dic.toString();
    }
}
