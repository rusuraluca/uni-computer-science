package Model.Statements;

import Exceptions.ExpressionEvaluationException;
import Exceptions.StatementExecutionException;
import Exceptions.CollectionsException;

import Model.Collections.IDictionary;
import Model.ProgramState.ProgramState;

import Model.Expressions.IExpression;
import Model.Collections.IStack;
import Model.Types.IType;
import Model.Values.IValue;

import Model.Types.BoolType;
import Model.Values.BoolValue;

/**
 * Class that represents the If statement
 */
public class IfStatement implements IStatement {
    IExpression expression;
    IStatement thenS;
    IStatement elseS;

    public IfStatement(IExpression e, IStatement t, IStatement el) {
        this.expression = e;
        this.thenS = t;
        this.elseS = el;
    }

    @Override
    public ProgramState execute(ProgramState state) throws StatementExecutionException, ExpressionEvaluationException, CollectionsException {
        IValue res = this.expression.eval(state.getSymbolTable(), state.getHeap());

        if (res.getType().equals(new BoolType())) {
            BoolValue boolRes = (BoolValue) res;
            IStatement toExecute;

            if (boolRes.getVal())
                toExecute = thenS;
            else
                toExecute = elseS;

            IStack<IStatement> stack = state.getExecutionStack();
            stack.push(toExecute);
            state.setExecutionStack(stack);
            return state;

        } else
            throw new StatementExecutionException("The condition of if has not the type bool");
    }

    @Override
    public IDictionary<String, IType> typecheck(IDictionary<String, IType> typeEnv) throws CollectionsException, ExpressionEvaluationException, StatementExecutionException {
        IType typeExpression = expression.typecheck(typeEnv);
        if (typeExpression.equals(new BoolType())){
            thenS.typecheck(typeEnv.copy());
            elseS.typecheck(typeEnv.copy());
            return typeEnv;
        } else
            throw new StatementExecutionException("The condition of if statement is not of type bool");
    }

    @Override
    public String toString() {
        return "(if(" + expression.toString() + ") then(" + thenS.toString() + ") else(" + elseS.toString() + "))";
    }
}
