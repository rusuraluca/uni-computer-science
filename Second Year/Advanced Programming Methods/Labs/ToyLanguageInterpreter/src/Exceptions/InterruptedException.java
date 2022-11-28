package Exceptions;

public class InterruptedException extends ToyLanguageInterpreterException {
    public InterruptedException(String message){
        super("InterruptedException: " + message);
    }
}
