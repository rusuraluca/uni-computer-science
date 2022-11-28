package Exceptions;

public class InvalidOperatorException extends ToyLanguageInterpreterException{
    public InvalidOperatorException(String message) {
        super("InvalidOperatorException: " + message);
    }
}
