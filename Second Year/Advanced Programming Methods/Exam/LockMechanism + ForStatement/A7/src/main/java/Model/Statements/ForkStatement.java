package Model.Statements;

import Exceptions.InterpreterException;
import Model.ProgramState.ProgramState;
import Model.Types.Type;
import Model.Collections.Dictionary;
import Model.Collections.IDictionary;
import Model.Collections.IStack;
import Model.Collections.Stack;
import Model.Value.Value;

import java.util.Map;

public class ForkStatement implements Statement {
    private final Statement statement;

    public ForkStatement(Statement statement) {
        this.statement = statement;
    }
    @Override
    public ProgramState execute(ProgramState state) throws InterpreterException {
        IStack<Statement> newStack = new Stack<>();
        newStack.push(statement);
        IDictionary<String, Value> newSymTable = new Dictionary<>();
        for (Map.Entry<String, Value> entry: state.getSymTable().getContent().entrySet()) {
            newSymTable.put(entry.getKey(), entry.getValue().deepCopy());
        }

        return new ProgramState(newStack, newSymTable, state.getOut(), state.getFileTable(), state.getHeap(), state.getLockTable());
    }

    @Override
    public IDictionary<String, Type> typeCheck(IDictionary<String, Type> typeEnv) throws InterpreterException {
        statement.typeCheck(typeEnv.deepCopy());
        return typeEnv;
    }

    @Override
    public Statement deepCopy() {
        return new ForkStatement(statement.deepCopy());
    }

    @Override
    public String toString() {
        return String.format("fork(%s)", statement.toString());
    }
}