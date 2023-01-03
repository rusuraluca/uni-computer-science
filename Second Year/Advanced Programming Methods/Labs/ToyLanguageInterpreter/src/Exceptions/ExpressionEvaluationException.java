package Exceptions;

/**
 * Class for exceptions in the expression evaluator
 */
public class ExpressionEvaluationException extends Exception {
    public ExpressionEvaluationException(String message) {
        super(message);
    }

    public ExpressionEvaluationException() {
        super();
    }
}

