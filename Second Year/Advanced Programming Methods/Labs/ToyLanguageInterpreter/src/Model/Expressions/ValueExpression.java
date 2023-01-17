package Model.Expressions;

import Exceptions.CollectionsException;
import Exceptions.ExpressionEvaluationException;
import Model.Collections.IDictionary;
import Model.Collections.IHeap;
import Model.Collections.MyDictionary;
import Model.Types.IType;
import Model.Values.IValue;

/**
 * Class for the Value expression, aka giving a value to a variable
 */
public class ValueExpression implements IExpression {
    IValue e;

    public ValueExpression(IValue e) {
        this.e = e;
    }

    @Override
    public IType typecheck(IDictionary<String, IType> typeEnv) throws CollectionsException, ExpressionEvaluationException{
        return e.getType();
    }

    @Override
    public IValue eval(IDictionary<String, IValue> tbl, IHeap heap) {
        return this.e;
    }

    @Override
    public String toString() {
        return this.e.toString();
    }
}
