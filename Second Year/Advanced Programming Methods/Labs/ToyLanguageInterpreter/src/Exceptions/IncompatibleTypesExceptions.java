package Exceptions;

public class IncompatibleTypesExceptions extends ToyLanguageInterpreterException{
    public IncompatibleTypesExceptions(String message) { super("IncompatibleTypesException: " + message); }
}
