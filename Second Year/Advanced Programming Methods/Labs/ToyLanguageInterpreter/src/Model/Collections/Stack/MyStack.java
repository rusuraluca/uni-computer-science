package Model.Collections.Stack;

import java.util.Stack;

public class MyStack<T> implements IStack<T> {
    public Stack <T> stack;

    public MyStack() {
        stack = new Stack<>();
    }

    @Override
    public T pop(){
        return stack.pop();
    }
    @Override
    public T peek(){
        return stack.peek();
    }
    @Override
    public void push(T e){
        stack.push(e);
    }

    @Override
    public boolean isEmpty(){
        return stack.isEmpty();
    }

    @Override
    public String toString(){
        return stack.toString();
    }
}
