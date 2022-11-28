package Exceptions;

public class IncompatibleValuesExceptions extends ToyLanguageInterpreterException{
    public IncompatibleValuesExceptions(String message) { super("IncompatibleValuesExceptions: " + message); }
}
