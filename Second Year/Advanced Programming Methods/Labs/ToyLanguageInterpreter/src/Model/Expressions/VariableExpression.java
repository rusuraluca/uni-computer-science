package Model.Expressions;

import Exceptions.ExpressionEvaluationException;
import Exceptions.CollectionsException;

import Model.Collections.IDictionary;
import Model.Collections.IHeap;
import Model.Collections.MyDictionary;
import Model.Types.IType;
import Model.Values.IValue;

/**
 * Class for Variable expression
 */
public class VariableExpression implements IExpression {
    String id;

    public VariableExpression(String id) {
        this.id = id;
    }

    @Override
    public IType typecheck(IDictionary<String, IType> typeEnv) throws CollectionsException, ExpressionEvaluationException{
        return typeEnv.lookUp(id);
    }

    @Override
    public IValue eval(IDictionary<String, IValue> tbl, IHeap heap) throws CollectionsException, ExpressionEvaluationException {
        return tbl.lookUp(id);
    }

    @Override
    public String toString() {
        return this.id;
    }
}
