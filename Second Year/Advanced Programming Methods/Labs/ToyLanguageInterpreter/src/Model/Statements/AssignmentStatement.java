package Model.Statements;

import Exceptions.ExpressionEvaluationException;
import Exceptions.StatementExecutionException;
import Exceptions.CollectionsException;

import Model.ProgramState.ProgramState;

import Model.Expressions.IExpression;
import Model.Types.IType;
import Model.Collections.IDictionary;
import Model.Values.IValue;

/**
 * Class that represents the Assignment statement
 */
public class AssignmentStatement implements IStatement {
    private final String id;
    private final IExpression exp;

    public AssignmentStatement(String id, IExpression exp) {
        this.id = id;
        this.exp = exp;
    }

    @Override
    public IDictionary<String, IType> typecheck(IDictionary<String, IType> typeEnv) throws CollectionsException, ExpressionEvaluationException, StatementExecutionException {
        IType typevar = typeEnv.lookUp(id);
        IType typeexp = exp.typecheck(typeEnv);
        if(typevar.equals(typeexp))
            return typeEnv;
        else
            throw new StatementExecutionException("Right hand side and left hand side of assignment have different types");
    }


    @Override
    public ProgramState execute(ProgramState state) throws StatementExecutionException, CollectionsException, ExpressionEvaluationException {
        IDictionary<String, IValue> symbolTable = state.getSymbolTable();

        if (symbolTable.containsKey(id)) {
            IValue val = exp.eval(symbolTable, state.getHeap());
            IType typId = (symbolTable.lookUp(id)).getType();
            if (val.getType().equals(typId))
                symbolTable.update(id, val);
            else
                throw new StatementExecutionException("Declared type of variable " + id + " and type of the assigned expression do not match.");
        } else
            throw new StatementExecutionException("The used variable " + id + " was not declared before.");

        state.setSymbolTable(symbolTable);
        return state;
    }

    @Override
    public String toString() {
        return this.id + " = " + this.exp.toString();
    }
}