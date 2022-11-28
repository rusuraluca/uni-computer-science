package View.Commands;

public class ExitCommand extends Command {
    public ExitCommand(String key, String description){
        super(key, description);
    }

    @Override
    public void executeComplete() {
        System.exit(0);
    }
}