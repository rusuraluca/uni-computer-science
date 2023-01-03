package Model.Statements;

import Exceptions.ExpressionEvaluationException;
import Exceptions.StatementExecutionException;
import Exceptions.CollectionsException;
import Model.Expressions.IExpression;
import Model.ProgramState.ProgramState;
import Model.Types.BoolType;
import Model.Types.IType;
import Model.Types.ReferenceType;
import Model.Collections.IDictionary;
import Model.Collections.IHeap;
import Model.Values.IValue;
import Model.Values.ReferenceValue;

/**
 * Class for the WriteHeap statement
 */
public class NewStatement implements IStatement {
    private final String varName;
    private final IExpression expression;

    public NewStatement(String varName, IExpression expression) {
        this.varName = varName;
        this.expression = expression;
    }

    @Override
    public ProgramState execute(ProgramState state) throws StatementExecutionException, ExpressionEvaluationException, CollectionsException {
        IDictionary<String, IValue> symbolTable = state.getSymbolTable();
        IHeap heap = state.getHeap();

        if (symbolTable.containsKey(varName)) {
            IValue varValue = symbolTable.lookUp(varName);

            if ((varValue.getType() instanceof ReferenceType)) {
                IValue evaluated = expression.eval(symbolTable, heap);
                IType locationType = ((ReferenceValue) varValue).getLocationType();

                if (locationType.equals(evaluated.getType())) {
                    int newPosition = heap.add(evaluated);
                    symbolTable.put(varName, new ReferenceValue(newPosition, locationType));
                    state.setSymbolTable(symbolTable);
                    state.setHeap(heap);
                } else
                    throw new StatementExecutionException(String.format("%s not of %s", varName, evaluated.getType()));
            } else {
                throw new StatementExecutionException(String.format("%s in not of RefType", varName));
            }
        } else {
            throw new StatementExecutionException(String.format("%s not in symTable", varName));
        }
        return null;
    }

    @Override
    public IDictionary<String, IType> typecheck(IDictionary<String, IType> typeEnv) throws CollectionsException, ExpressionEvaluationException, StatementExecutionException {
        IType typeVar = typeEnv.lookUp(varName);
        IType typeExpression = expression.typecheck(typeEnv);
        if (typeVar.equals(new ReferenceType(typeExpression)))
            return typeEnv;
        else
            throw new StatementExecutionException("Right hand side and left hand side of new statement have different types");
    }

    @Override
    public String toString() {
        return String.format("new(%s, %s)", varName, expression);
    }
}
