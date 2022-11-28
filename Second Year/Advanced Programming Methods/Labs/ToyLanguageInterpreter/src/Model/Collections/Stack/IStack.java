package Model.Collections.Stack;

public interface IStack<T>{
    T pop();
    T peek();
    void push(T e);
    boolean isEmpty();
    String toString();
}
