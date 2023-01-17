package Model.Statements;

import Exceptions.ExpressionEvaluationException;
import Exceptions.CollectionsException;

import Exceptions.StatementExecutionException;
import Model.Collections.IDictionary;
import Model.ProgramState.ProgramState;

import Model.Expressions.IExpression;
import Model.Collections.IList;
import Model.Types.IType;
import Model.Values.IValue;

/**
 * Class that represents the Print statement
 */
public class PrintStatement implements IStatement {
    IExpression expression;

    public PrintStatement(IExpression expression) {
        this.expression = expression;
    }

    @Override
    public IDictionary<String, IType> typecheck(IDictionary<String, IType> typeEnv) throws CollectionsException, ExpressionEvaluationException, StatementExecutionException {
        expression.typecheck(typeEnv);
        return typeEnv;
    }

    @Override
    public ProgramState execute(ProgramState state) throws ExpressionEvaluationException, CollectionsException {
        IList<IValue> outputList = state.getOutputList();
        outputList.add(expression.eval(state.getSymbolTable(), state.getHeap()));
        state.setOutputList(outputList);
        return state;
    }

    @Override
    public String toString() {
        return "print(" + expression.toString() + ")";
    }
}
