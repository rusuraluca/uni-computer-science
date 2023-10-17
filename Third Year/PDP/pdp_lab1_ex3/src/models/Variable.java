package models;

import java.util.concurrent.locks.ReentrantLock;

public class Variable {
    private int value = 0;

    public Variable (int value){
        this.value = value;
    }
    public Variable (){}

    public ReentrantLock mutex = new ReentrantLock();

    public int getValue() {
        return value;
    }



    private ArrayList<Node> inputs = new ArrayList<>();
    private ArrayList<Node> secondary = new ArrayList<>(); //sum nodes
}
