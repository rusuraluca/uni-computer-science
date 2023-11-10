import java.util.*;
import java.util.concurrent.ThreadLocalRandom;

class modifyVariablesTask extends TimerTask {
    @Override
    public void run() {
        int index = ThreadLocalRandom.current().nextInt(0, Main.primaryVariables.size());
        Variable var = Main.primaryVariables.get(index);
        int value = ThreadLocalRandom.current().nextInt(-10, 11);
        var.setValue(value);
    }
}

class runCheckerTask extends TimerTask {
    @Override
    public void run() {
        Checker consistencyChecker = new Checker(Main.variables);
        System.out.println("Running checker...");
        boolean result = consistencyChecker.run();
        System.out.println("Checker result " + result);
    }
}

public class Main {
    public static ArrayList<Variable> primaryVariables = new ArrayList<>();
    public static ArrayList<Variable> secondaryVariables = new ArrayList<>();
    public static ArrayList<Variable> variables = new ArrayList<>();


    public static void main(String[] args) {
        createVariables();
        //createRandomVariables();
        modifyVariables();
        runChecker();
    }

    private static void modifyVariables() {
        for (int i = 0; i < 10; ++i) {
            Timer timer = new Timer();
            timer.schedule(new modifyVariablesTask(), 0, 1);
        }
    }

    private static void runChecker() {
        Timer timer = new Timer();
        timer.schedule(new runCheckerTask(), 3, 1);
    }

    private static void createVariables() {
        Variable primary1 = new Variable(2);
        Variable primary2 = new Variable(3);
        Variable primary3 = new Variable(1);

        variables.add(primary1);
        variables.add(primary2);
        variables.add(primary3);
        primaryVariables.add(primary1);
        primaryVariables.add(primary2);
        primaryVariables.add(primary3);

        Variable secondSecondary1 = new Variable();
        Variable secondSecondary2 = new Variable();

        variables.add(secondSecondary1);
        variables.add(secondSecondary2);

        primary1.addDependent(secondSecondary1);
        primary2.addDependent(secondSecondary1);
        primary2.addDependent(secondSecondary2);
        primary3.addDependent(secondSecondary2);

        for (Variable var : variables) {
            System.out.println("Variable with value: " + var.getValue());
        }
    }

    private static void createRandomVariables() {
        int variableNo = 5;
        int dependentsNo = 4;
        Random rand = new Random();

        for (int i = 0; i < variableNo; ++i) {
            int value = rand.nextInt(10);
            Variable primary = new Variable(value);
            primaryVariables.add(primary);
            variables.add(primary);
        }

        for (int i = 0; i < dependentsNo; ++i) {
            Variable secondary = new Variable();
            secondaryVariables.add(secondary);
            variables.add(secondary);
        }

        for (int i = 0; i < primaryVariables.size(); ++i) {
            Variable primary = Main.primaryVariables.get(i);
            int dependents = rand.nextInt(0, dependentsNo);
            for (int j = 0; j < dependents; ++j) {
                int id = rand.nextInt(Main.secondaryVariables.size());
                Variable secondary = Main.secondaryVariables.get(id);
                primary.addDependent(secondary);
            }
        }
        System.out.println("Primary values");
        for (Variable var : primaryVariables) {
            System.out.println("Variable with value: " + var.getValue());
            if (!var.getDependents().isEmpty()) {
                for (Variable dependent : var.getDependents()){
                    System.out.println(" - dependent with value: " + dependent.getValue());
                }
            }
        }
        System.out.println("Secondary values");
        for (Variable var : secondaryVariables) {
            System.out.println("Secondary values with value: " + var.getValue());
        }
    }
}