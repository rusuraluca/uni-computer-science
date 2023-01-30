package Model.Statements;

import Exceptions.InterpreterException;
import Model.Collections.MyIDictionary;
import Model.Collections.MyIStack;
import Model.ProgramState.ProgramState;
import Model.Types.Type;

public class SleepStatement implements Statement {
    private final Integer number;

    public SleepStatement(Integer number) {
        this.number =  number;
    }

    @Override
    public ProgramState execute(ProgramState state) throws InterpreterException {
        MyIStack<Statement> exeStack = state.getExeStack();
        if (number > 0) {
            exeStack.push(new SleepStatement(number - 1));
            state.setExeStack(exeStack);
        }
        return null;
    }

    @Override
    public MyIDictionary<String, Type> typeCheck(MyIDictionary<String, Type> typeEnv) throws InterpreterException{
        return typeEnv;
    }

    @Override
    public Statement deepCopy() {
        return new SleepStatement(number);
    }

    @Override
    public String toString() {
        return String.format("sleep(%d)", number);
    }
}
