package Exceptions;

public class ToyLanguageInterpreterException extends Exception{
    public ToyLanguageInterpreterException(String message) {
        super("ToyLanguageInterpreterException: " + message);
    }
}
