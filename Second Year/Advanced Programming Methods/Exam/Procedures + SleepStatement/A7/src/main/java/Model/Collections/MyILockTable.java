package Model.Collections;

import Exceptions.InterpreterException;

import java.util.HashMap;
import java.util.Set;

public interface MyILockTable {
    int getFreeValue();
    void put(int key, int value) throws InterpreterException;
    HashMap<Integer, Integer> getContent();
    boolean containsKey(int position);
    int get(int position) throws InterpreterException;
    void update(int position, int value) throws InterpreterException;
    void setContent(HashMap<Integer, Integer> newMap);
    Set<Integer> keySet();
}
