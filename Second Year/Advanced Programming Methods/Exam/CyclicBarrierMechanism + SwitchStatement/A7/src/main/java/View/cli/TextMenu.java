package View.cli;

import Exceptions.InterpreterException;
import Model.Collections.MyDictionary;
import Model.Collections.IDictionary;

import java.util.Scanner;

public class TextMenu {
    private IDictionary<String, Command> commands;

    public TextMenu() {
        this.commands = new MyDictionary<>();
    }

    public void addCommand(Command command){
        try {
            this.commands.put(command.getKey(), command);
        } catch (InterpreterException e) {
            throw new RuntimeException(e);
        }
    }

    private void printMenu(){
        for(Command command: commands.getContent().values()){
            String line = String.format("%4s: %s", command.getKey(), command.getDescription());
            System.out.println(line);
        }
    }

    public void show(){
        Scanner scanner = new Scanner(System.in);
        while(true){
            printMenu();
            System.out.println("Input the option: ");
            String key = scanner.nextLine();
            try{
                Command command = commands.lookUp(key);
                command.execute();
            }catch(InterpreterException exception){
                System.out.println("Invalid option");
            }
        }
    }


}
