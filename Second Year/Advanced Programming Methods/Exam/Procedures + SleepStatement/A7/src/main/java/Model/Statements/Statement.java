package Model.Statements;


import Exceptions.InterpreterException;
import Model.ProgramState.ProgramState;
import Model.Types.Type;
import Model.Collections.MyIDictionary;

public interface Statement {
        ProgramState execute(ProgramState state) throws InterpreterException;
        MyIDictionary<String, Type> typeCheck(MyIDictionary<String, Type> typeEnv) throws InterpreterException;
        Statement deepCopy();
}