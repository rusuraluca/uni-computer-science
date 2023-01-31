package Model.Collections;


import Exceptions.InterpreterException;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

public class MyStack<T> implements IStack<T> {
    java.util.Stack<T> stack;

    public MyStack() {
        this.stack = new java.util.Stack<>();
    }

    @Override
    public T pop() throws InterpreterException {
        if (stack.isEmpty())
            throw new InterpreterException("Stack is empty!");
        return this.stack.pop();
    }

    @Override
    public void push(T element) {
        this.stack.push(element);
    }

    @Override
    public String toString() {
        return this.stack.toString();
    }

    @Override
    public T peek() {
        return this.stack.peek();
    }

    @Override
    public boolean isEmpty() {
        return this.stack.isEmpty();
    }

    @Override
    public List<T> getReversed() {
        List<T> list = Arrays.asList((T[]) stack.toArray());
        Collections.reverse(list);
        return list;
    }
}