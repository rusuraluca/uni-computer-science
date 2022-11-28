package Exceptions;

public class DivisionByZero extends ToyLanguageInterpreterException {
    public DivisionByZero(String message) {
        super("DivisionByZeroException: " + message);
    }
}

