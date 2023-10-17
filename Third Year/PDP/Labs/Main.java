import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.Timer;
import java.util.TimerTask;

class Variable {
    private final int id;
    private int value;
    private final List<Integer> inputs = new ArrayList<>();
    private final List<Integer> dependentVariables = new ArrayList<>();

    public Variable(int id, int value) {
        this.id = id;
        this.value = value;
    }

    public int getId() {
        return id;
    }

    public int getValue() {
        return value;
    }

    public void setValue(int value) {
        this.value = value;
    }

    public List<Integer> getInputs() {
        return inputs;
    }

    public List<Integer> getDependentVariables() {
        return dependentVariables;
    }
}

public class Main {
    private static final List<Variable> variables = new ArrayList<>();
    private static final List<Object> variableLocks = new ArrayList<>();
    private static final Object consistencyCheckLock = new Object();

    public static void main(String[] args) throws InterruptedException {
        generatePrimaryVariables(10);
        generateSecondaryVariables(10);

        int numThreads = 10;
        int numNotificationsPerThread = 10000;

        List<Thread> threads = new ArrayList<>();
        for (int i = 0; i < numThreads; i++) {
            threads.add(new Thread(() -> threadFunction(numNotificationsPerThread)));
            threads.get(i).start();
        }

        Timer timer = new Timer(true);
        timer.scheduleAtFixedRate(new ConsistencyCheckTask(), 0, 30 * 1000);
        
        for (Thread thread : threads) {
            thread.join();
        }
    }

    private static void generatePrimaryVariables(int numPrimary) {
        Random random = new Random();
        for (int i = 0; i < numPrimary; i++) {
            int value = random.nextInt(100);
            variables.add(new Variable(i, value));
            variableLocks.add(new Object());
        }
    }

    private static void generateSecondaryVariables(int numSecondary) {
        for (int i = 10; i < 20; i++) {
            int sum = 0;
            for (int j = 0; j < 10; j++) {
                sum += variables.get(j).getValue();
                variables.get(j).getDependentVariables().add(i);
            }
            variables.add(new Variable(i, sum));
            variableLocks.add(new Object());
            for (int j = 0; j < 10; j++) {
                variables.get(i).getInputs().add(j);
            }
        }
    }

    private static void threadFunction(int numNotifications) {
        Random random = new Random();
        System.out.println("Thread " + Thread.currentThread().getId() + " started");
        for (int i = 0; i < numNotifications; i++) {
            int varID = random.nextInt(20);
            int newValue = random.nextInt(100); 
            processNotification(varID, newValue);
        }
        System.out.println("Thread " + Thread.currentThread().getId() + " ended");
    }

    private static void processNotification(int variableID, int newValue) {
        synchronized (variableLocks.get(variableID)) {
            int oldValue = variables.get(variableID).getValue();
            int diff = newValue - oldValue;
            variables.get(variableID).setValue(newValue);

            for (int depVarID : variables.get(variableID).getDependentVariables()) {
                synchronized (variableLocks.get(depVarID)) {
                    variables.get(depVarID).setValue(variables.get(depVarID).getValue() + diff);
                }
            }
        }
    }

    private static void consistencyCheck() {
        synchronized (consistencyCheckLock) {
            for (Variable var : variables) {
                if (var.getInputs().size() != 0) {
                    int sum = 0;
                    for (int inputID : var.getInputs()) {
                        sum += variables.get(inputID).getValue();
                    }
                    if (var.getValue() != sum) {
                        System.out.println("CONSISTENCY TEST for variable " + var.getId() + ": FAILED");
                    } else {
                        System.out.println("CONSISTENCY TEST for variable " + var.getId() + ": PASSED");
                    }
                }
            }
        }
    }

    private static class ConsistencyCheckTask extends TimerTask {
        @Override
        public void run() {
            consistencyCheck();
        }
    }
}
