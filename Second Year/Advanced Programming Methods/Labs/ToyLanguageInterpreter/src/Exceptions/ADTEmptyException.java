package Exceptions;

public class ADTEmptyException extends ToyLanguageInterpreterException {
    public ADTEmptyException(String message){
        super("ADTEmptyException: " + message);
    }
}