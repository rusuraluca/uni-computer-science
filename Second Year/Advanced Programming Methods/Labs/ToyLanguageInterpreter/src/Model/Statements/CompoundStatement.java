package Model.Statements;

import Exceptions.CollectionsException;
import Exceptions.ExpressionEvaluationException;
import Exceptions.StatementExecutionException;
import Model.Collections.IDictionary;
import Model.ProgramState.ProgramState;
import Model.Collections.IStack;
import Model.Types.IType;

/**
 * Class that represents the Compound statement (a statement that contains two other statements)
 */
public class CompoundStatement implements IStatement {
    IStatement first;
    IStatement second;

    public CompoundStatement(IStatement first, IStatement second) {
        this.first = first;
        this.second = second;
    }

    @Override
    public IDictionary<String, IType> typecheck(IDictionary<String, IType> typeEnv) throws CollectionsException, ExpressionEvaluationException, StatementExecutionException{
        return second.typecheck(first.typecheck(typeEnv));
    }

    @Override
    public ProgramState execute(ProgramState state) {
        IStack<IStatement> stack = state.getExecutionStack();
        stack.push(second);
        stack.push(first);
        state.setExecutionStack(stack);
        return state;
    }

    @Override
    public String toString() {
        return "(" + first.toString() + "; " + second.toString() + ")";
    }
}
