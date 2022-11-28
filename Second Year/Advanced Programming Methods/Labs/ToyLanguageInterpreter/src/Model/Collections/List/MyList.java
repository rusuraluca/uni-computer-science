package Model.Collections.List;

import java.util.ArrayList;
import java.util.List;

public class MyList<T> implements IList<T> {
    public ArrayList<T> list;

    public MyList(){ list = new ArrayList<T>(); }

    @Override
    public void add(T e){
        list.add(e);
    }

    @Override
    public int size(){
        return list.size();
    }

    @Override
    public T get(int idx){
        return list.get(idx);
    }

    @Override
    public void clear(){
        list.clear();
    }

    @Override
    public boolean contains(T e){
        return list.contains(e);
    }

    @Override
    public boolean isEmpty(){
        return list.isEmpty();
    }

    @Override
    public String toString(){
        return list.toString();
    }
}
