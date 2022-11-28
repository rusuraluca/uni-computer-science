package Model.Statements;

import Model.Collections.Stack.IStack;
import Model.Collections.Dictionary.IDictionary;
import Exceptions.ToyLanguageInterpreterException;
import Model.Types.Type;
import Model.ProgramState;

public class CompoundStmt implements IStmt {
    IStmt first;
    IStmt second;

    public CompoundStmt(IStmt first, IStmt second) {
        this.first = first;
        this.second = second;
    }

    @Override
    public IStmt deepCopy(){
        return new CompoundStmt(first.deepCopy(), second.deepCopy());
    }

    @Override
    public IDictionary<String, Type> typeCheck(IDictionary<String, Type> typeTable) throws ToyLanguageInterpreterException {
        return second.typeCheck(first.typeCheck(typeTable));
    }


    @Override
    public ProgramState execute(ProgramState state){
        IStack<IStmt> executionStack = state.getExecutionStack();

        executionStack.push(second);
        executionStack.push(first);

        return state;
    }

    @Override
    public String toString() { return "(" + first.toString() + ";" + second.toString() + ")"; }
}
