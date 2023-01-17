package Model.Statements;

import Exceptions.ExpressionEvaluationException;
import Exceptions.StatementExecutionException;
import Exceptions.CollectionsException;
import Model.Collections.IDictionary;
import Model.Expressions.IExpression;
import Model.ProgramState.ProgramState;
import Model.Types.BoolType;
import Model.Collections.IStack;
import Model.Types.IType;
import Model.Values.BoolValue;
import Model.Values.IValue;

/**
 * Class that represents the While statement
 */
public class WhileStatement implements IStatement {
    private final IExpression expression;
    private final IStatement statement;

    public WhileStatement(IExpression expression, IStatement statement) {
        this.expression = expression;
        this.statement = statement;
    }

    @Override
    public IDictionary<String, IType> typecheck(IDictionary<String, IType> typeEnv) throws CollectionsException, ExpressionEvaluationException, StatementExecutionException {
        IType type = expression.typecheck(typeEnv);
        if (type.equals(new BoolType())) {
            statement.typecheck(typeEnv.copy());
            return typeEnv;
        } else
            throw new StatementExecutionException("The condition of While statement has not the type bool");
    }

    @Override
    public ProgramState execute(ProgramState state) throws StatementExecutionException, ExpressionEvaluationException, CollectionsException {
        IValue value = expression.eval(state.getSymbolTable(), state.getHeap());
        IStack<IStatement> stack = state.getExecutionStack();

        if (!value.getType().equals(new BoolType()))
            throw new StatementExecutionException(String.format("%s is not of BoolType", value));

        if (!(value instanceof BoolValue))
            throw new StatementExecutionException(String.format("%s is not a BoolValue", value));

        BoolValue boolValue = (BoolValue) value;

        if (boolValue.getVal()) {
            stack.push(statement);
        }
        return null;
    }

    @Override
    public String toString() {
        return String.format("while(%s){%s}", expression, statement);
    }
}
