package Model.Statements;

import Exceptions.ExpressionEvaluationException;
import Exceptions.StatementExecutionException;
import Exceptions.CollectionsException;
import Model.Expressions.IExpression;
import Model.ProgramState.ProgramState;
import Model.Types.IType;
import Model.Types.ReferenceType;
import Model.Collections.IDictionary;
import Model.Collections.IHeap;
import Model.Values.IValue;
import Model.Values.ReferenceValue;

/**
 * Class that implements the WriteHeap statement, that is used for writing a value in the heap at a given address
 */
public class WriteHeapStatement implements IStatement {
    private final String varName;
    private final IExpression expression;

    public WriteHeapStatement(String varName, IExpression expression) {
        this.varName = varName;
        this.expression = expression;
    }

    @Override
    public ProgramState execute(ProgramState state) throws StatementExecutionException, ExpressionEvaluationException, CollectionsException {
        IDictionary<String, IValue> symbolTable = state.getSymbolTable();
        IHeap heap = state.getHeap();

        if (symbolTable.containsKey(varName)) {
            IValue value = symbolTable.lookUp(varName);

            if (value.getType() instanceof ReferenceType) {
                ReferenceValue referenceValue = (ReferenceValue) value;

                if (heap.containsKey(referenceValue.getAddress())) {
                    IValue evaluated = expression.eval(symbolTable, heap);

                    if (evaluated.getType().equals(referenceValue.getLocationType())) {
                        heap.update(referenceValue.getAddress(), evaluated);
                        state.setHeap(heap);
                    } else
                        throw new StatementExecutionException(String.format("%s not of %s", evaluated, referenceValue.getLocationType()));
                } else
                    throw new StatementExecutionException(String.format("The ReferenceValue %s is not defined in the heap", value));
            } else
                throw new StatementExecutionException(String.format("%s not of ReferenceType", value));
        } else
            throw new StatementExecutionException(String.format("%s not present in the SymbolTable", varName));
        return null;
    }

    @Override
    public IDictionary<String, IType> typecheck(IDictionary<String, IType> typeEnv) throws CollectionsException, ExpressionEvaluationException, StatementExecutionException {
        if (typeEnv.get(varName).equals(new ReferenceType(expression.typecheck(typeEnv))))
            return typeEnv;
        else
            throw new StatementExecutionException("Right hand side and left hand side of wH statement have different types");

    }

    @Override
    public String toString() {
        return String.format("wH(%s, %s)", varName, expression);
    }
}
