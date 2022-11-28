package Exceptions;

public class VariableAlreadyDeclaredException extends ToyLanguageInterpreterException {

    public VariableAlreadyDeclaredException(String message){ super("VariableAlreadyDeclaredException: " + message); }
}
