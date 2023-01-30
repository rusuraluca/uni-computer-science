package Model.Collections;


import Exceptions.InterpreterException;

import java.util.ArrayList;
import java.util.List;

public class MyList<T> implements MyIList<T>{
    List<T> list;

    public MyList() {
        this.list = new ArrayList<>();
    }

    public T get(int index) throws InterpreterException {
        if (index < 0 || index >= list.size())
            throw new InterpreterException("Index out of bounds!");
        try {
            return list.get(index);
        } catch (Exception exception) {
            throw new InterpreterException(exception.getMessage());
        }
    }

    public int size() {
        return list.size();
    }

    @Override
    public void add(T elem) {
        this.list.add(elem);
    }

    @Override
    public T pop() throws InterpreterException {
        if (list.isEmpty())
            throw new InterpreterException("The list is empty!");
        return this.list.remove(0);
    }

    @Override
    public boolean isEmpty() {
        return this.list.isEmpty();
    }

    @Override
    public List<T> getList() {
        return list;
    }

    @Override
    public String toString() {
        return this.list.toString();
    }
}