import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.locks.ReentrantLock;

public class Variable {
    public ReentrantLock mutex = new ReentrantLock();
    private int value = 0;
    private final ArrayList<Variable> inputs = new ArrayList<>();
    private final List<Variable> dependents = new ArrayList<>();

    public Variable() {}

    public Variable(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }

    public void addValue(int value) {
        this.value += value;
    }

    public void lockDependent(Variable variable) {
        variable.getDependents().forEach(secondary -> {
            secondary.mutex.lock();
            lockDependent(secondary);
        });
    }

    public void unlockDependent(Variable variable) {
        variable.getDependents().forEach(secondary -> {
            secondary.mutex.unlock();
            unlockDependent(secondary);
        });
    }

    public void subtractValue(int value) {
        this.value -= value;
    }

    public void setValue(int value) {
        //mutex.lock();
        //lockDependent(this);
        int diff = this.value - value;
        this.value = value;
        for (Variable dependent : dependents) {
            dependent.subtractValue(diff);
        }
        //unlockDependent(this);
        //mutex.unlock();
    }

    public void addInput(Variable input){
        this.inputs.add(input);
    }

    public ArrayList<Variable> getInputs() {
        return inputs;
    }

    public void addDependent(Variable dependent) {
        this.dependents.add(dependent);
        dependent.addInput(this);
        dependent.addValue(this.value);
    }

    public List<Variable> getDependents() {
        return dependents;
    }
}