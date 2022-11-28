package Exceptions;

public class InvalidOperationException extends ToyLanguageInterpreterException{
    public InvalidOperationException(String message) {
        super("InvalidOperationException: " + message);
    }
}
