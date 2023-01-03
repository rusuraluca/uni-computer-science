package View.Menu;

import Controller.Controller;
import Exceptions.ExpressionEvaluationException;
import Exceptions.StatementExecutionException;
import Exceptions.CollectionsException;

import java.io.IOException;

/**
 * Class that implements the command pattern
 */
public class RunCommand extends Command {
    private final Controller controller;

    public RunCommand(String key, String description, Controller controller) {
        super(key, description);
        this.controller = controller;
    }

    @Override
    public void execute() {
        try {
            controller.allSteps();
        } catch (ExpressionEvaluationException | CollectionsException | StatementExecutionException | IOException | InterruptedException exception) {
            System.out.println(exception.getMessage());
        }

    }
}
