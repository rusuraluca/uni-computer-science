package Model.Statements;

import Exceptions.InterpreterException;
import Model.Collections.MyIDictionary;
import Model.ProgramState.ProgramState;
import Model.Types.Type;

public class FunctionReturnStatement implements Statement {
    @Override
    public ProgramState execute(ProgramState state) throws InterpreterException {
        try {
            state.getAllSymTables().pop();
        } catch (InterpreterException e) {
            throw new InterpreterException(e.getMessage());
        }

        return null;
    }

    @Override
    public MyIDictionary<String, Type> typeCheck(MyIDictionary<String, Type> typeEnv) throws InterpreterException {
        return typeEnv;
    }

    @Override
    public Statement deepCopy() {
        return new FunctionReturnStatement();
    }

    @Override
    public String toString() {
        return "return";
    }
}
