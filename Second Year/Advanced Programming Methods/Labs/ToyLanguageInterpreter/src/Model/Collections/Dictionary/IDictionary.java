package Model.Collections.Dictionary;

import java.util.Set;
import java.util.Map;

public interface IDictionary<K, V> {
    void put(K v1, V v2);
    V get(K id);
    boolean containsKey(K id);
    Set<K> keySet();
    void remove(K key);
    Map<K, V> getContent();
    IDictionary<K, V> copy();
}
