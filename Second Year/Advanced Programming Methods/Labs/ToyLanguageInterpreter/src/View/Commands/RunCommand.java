package View.Commands;

import Controller.Controller;
import Exceptions.ToyLanguageInterpreterException;

public class RunCommand extends Command {
    private Controller controller;

    public RunCommand(String key, String description, Controller controller) {
        super(key, description);
        this.controller = controller;
    }

    @Override
    public void executeComplete() {
        try {
            controller.completeExecutionOfProgram();
        } catch (java.io.IOException e) {
            System.out.println(e.getMessage());
        } catch (ToyLanguageInterpreterException e) {
            System.out.println(e.getMessage());
        }
    }
}