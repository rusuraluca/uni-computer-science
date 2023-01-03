package Exceptions;

/**
 * Class for exceptions in the statement execution
 */
public class StatementExecutionException extends Exception {
    public StatementExecutionException(String message) {
        super(message);
    }

    public StatementExecutionException() {
        super();
    }
}
