package Repository;

import Exceptions.ToyLanguageInterpreterException;
import Model.ProgramState;

import java.io.IOException;

public interface IRepository {
    ProgramState getCurrentProgram();

    void logProgramStateExecution(ProgramState programState) throws IOException;
}
