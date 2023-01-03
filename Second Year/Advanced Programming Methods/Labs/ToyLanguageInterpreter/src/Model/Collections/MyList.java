package Model.Collections;

import Exceptions.CollectionsException;

import java.util.ArrayList;
import java.util.List;

public class MyList<T> implements IList<T> {
    List<T> myList;

    public MyList() {
        this.myList = new ArrayList<>();
    }

    @Override
    public void add(T e) {
        this.myList.add(e);
    }

    @Override
    public String toString() {
        return this.myList.toString();
    }

    @Override
    public T pop() throws CollectionsException {
        if (myList.isEmpty())
            throw new CollectionsException("List is empty!");

        return this.myList.remove(0);
    }

    @Override
    public boolean isEmpty() {
        return this.myList.isEmpty();
    }

    @Override
    public List<T> getList() {
        return myList;
    }
}