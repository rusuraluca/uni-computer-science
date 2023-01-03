package Repository;

import Exceptions.CollectionsException;
import Model.ProgramState.ProgramState;

import java.io.IOException;
import java.util.List;

/**
 * Interface for the repository
 **/
public interface IRepository {
    List<ProgramState> getProgramList();
    List<ProgramState> getProgramStates();
    void setProgramStates(List<ProgramState> programStates);
    void addProgram(ProgramState programState);
    void logProgramStateExecution(ProgramState programState) throws CollectionsException, IOException;
    void emptyLogFile() throws IOException;
}
