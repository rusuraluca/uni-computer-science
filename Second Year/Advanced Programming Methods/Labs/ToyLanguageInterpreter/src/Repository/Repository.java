package Repository;

import Model.Collections.List.MyList;
import Model.ProgramState;
import Model.Values.StringValue;

import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;

public class Repository implements IRepository {
    private MyList<ProgramState> programStateList;
    private final StringValue logFilePath;

    public Repository(StringValue logFilePath) {
        this.programStateList = new MyList<>();
        this.logFilePath = logFilePath;
    }

    public Repository(MyList<ProgramState> programStateList, StringValue logFilePath){
        this.programStateList = programStateList;
        this.logFilePath = logFilePath;
    }

    @Override
    public ProgramState getCurrentProgram() { return programStateList.get(programStateList.size()-1); }

    @Override
    public void logProgramStateExecution(ProgramState programState) throws IOException {
        PrintWriter logFile;
        logFile = new PrintWriter(new BufferedWriter(new FileWriter(logFilePath.toString(), true)));
        logFile.println("\n\nProgram State");
        logFile.println(programState.toString());
        logFile.close();
    }
}
