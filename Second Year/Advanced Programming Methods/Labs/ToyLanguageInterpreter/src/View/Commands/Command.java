package View.Commands;

import Exceptions.ToyLanguageInterpreterException;

import java.io.IOException;

public abstract class Command {
    private String key, description;

    public Command(String key, String description){
        this.key = key;
        this.description = description;
    }

    public String getKey(){
        return key;
    }

    public String getDescription() {
        return description;
    }

    public abstract void executeComplete() throws IOException, ToyLanguageInterpreterException;
}
