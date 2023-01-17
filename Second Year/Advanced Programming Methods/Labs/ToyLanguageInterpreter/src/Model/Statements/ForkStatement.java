package Model.Statements;

import Exceptions.ExpressionEvaluationException;
import Exceptions.StatementExecutionException;
import Exceptions.CollectionsException;
import Model.ProgramState.ProgramState;
import Model.Collections.IDictionary;
import Model.Collections.IStack;
import Model.Collections.MyDictionary;
import Model.Collections.MyStack;
import Model.Types.BoolType;
import Model.Types.IType;
import Model.Values.IValue;

import java.util.Map;

/**
 * Class that creates a new thread
 */
public class ForkStatement implements IStatement {
    private final IStatement statement;

    public ForkStatement(IStatement statement) {
        this.statement = statement;
    }

    @Override
    public IDictionary<String, IType> typecheck(IDictionary<String, IType> typeEnv) throws CollectionsException, ExpressionEvaluationException, StatementExecutionException {
        statement.typecheck(typeEnv.copy());
        return typeEnv;
    }

    @Override
    public ProgramState execute(ProgramState state) throws StatementExecutionException, ExpressionEvaluationException, CollectionsException {
        // create a new stack and a new symbol table for the new thread
        IStack<IStatement> newStack = new MyStack<>();
        newStack.push(statement);
        IDictionary<String, IValue> newSymbolTable = new MyDictionary<>();

        for (Map.Entry<String, IValue> entry : state.getSymbolTable().getContent().entrySet()) {
            newSymbolTable.put(entry.getKey(), entry.getValue());
        }

        return new ProgramState(newStack, newSymbolTable, state.getOutputList(), state.getFileTable(), state.getHeap());
    }

    @Override
    public String toString() {
        return String.format("fork(%s", statement.toString());
    }
}
