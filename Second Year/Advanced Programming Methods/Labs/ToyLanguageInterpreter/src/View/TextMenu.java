package View;

import Exceptions.ToyLanguageInterpreterException;
import View.Commands.Command;
import java.util.HashMap;
import java.util.Map;
import java.util.Scanner;

public class TextMenu {
    private Map<String, Command> commands;

    public TextMenu(){
        this.commands = new HashMap<>();
    }

    public void addCommand(Command c){
        this.commands.put(c.getKey(), c);
    }

    private void printMenu(){
        for(Command com : this.commands.values()){
            String line = String.format("Press %s for: %s", com.getKey(), com.getDescription());
            System.out.println(line);
        }
    }

    public void show(){
        Scanner scanner = new Scanner(System.in);
        while(true){
            printMenu();
            System.out.printf("Input the option: ");
            String key = scanner.nextLine();
            Command com = this.commands.get(key);
            if (com == null){
                System.out.println("Invalid option!");
                continue;
            }
            try{
                com.executeComplete();
            } catch (Exception e){
                System.out.println("Error!");
            }
        }
    }
}