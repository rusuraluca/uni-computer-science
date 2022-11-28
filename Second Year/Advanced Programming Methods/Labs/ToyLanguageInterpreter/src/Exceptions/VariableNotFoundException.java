package Exceptions;

public class VariableNotFoundException extends ToyLanguageInterpreterException{
    public VariableNotFoundException(String message){ super("VariableNotFoundException: " + message); }
}
