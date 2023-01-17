package Model.Expressions;

import Exceptions.ExpressionEvaluationException;
import Exceptions.CollectionsException;
import Model.Collections.IDictionary;
import Model.Collections.IHeap;
import Model.Collections.MyDictionary;
import Model.Types.IType;
import Model.Types.ReferenceType;
import Model.Values.IValue;
import Model.Values.ReferenceValue;

/**
 * Class that represents the readHeap expression
 */
public class ReadHeapExpression implements IExpression {
    private final IExpression expression;

    public ReadHeapExpression(IExpression expression) {
        this.expression = expression;
    }

    @Override
    public IType typecheck(IDictionary<String, IType> typeEnv) throws CollectionsException, ExpressionEvaluationException{
        IType type = expression.typecheck(typeEnv);
        if (type instanceof ReferenceType){
            ReferenceType reftype = (ReferenceType) type;
            return reftype.getInner();
        } else
            throw new ExpressionEvaluationException("The rH argument is not of ReferenceType");
    }

    @Override
    public IValue eval(IDictionary<String, IValue> symTable, IHeap heap) throws ExpressionEvaluationException, CollectionsException {
        IValue value = expression.eval(symTable, heap);

        if (value instanceof ReferenceValue) {
            ReferenceValue referenceValue = (ReferenceValue) value;

            if (heap.containsKey(referenceValue.getAddress()))
                return heap.get(referenceValue.getAddress());
            else
                throw new ExpressionEvaluationException("The address is not defined on the heap");
        } else
            throw new ExpressionEvaluationException(String.format("%s not of ReferenceType", value));
    }

    @Override
    public String toString() {
        return String.format("rH(%s)", expression);
    }
}
