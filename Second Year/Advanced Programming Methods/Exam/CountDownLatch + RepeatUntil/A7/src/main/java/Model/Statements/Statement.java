package Model.Statements;


import Exceptions.InterpreterException;
import Model.ProgramState.ProgramState;
import Model.Types.Type;
import Model.Collections.IDictionary;

public interface Statement {
        ProgramState execute(ProgramState state) throws InterpreterException;
        IDictionary<String, Type> typeCheck(IDictionary<String, Type> typeEnv) throws InterpreterException;
        Statement deepCopy();
}