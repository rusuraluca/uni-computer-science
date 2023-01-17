package Model.Expressions;

import Exceptions.ExpressionEvaluationException;
import Exceptions.CollectionsException;

import Model.Collections.IDictionary;
import Model.Collections.IHeap;
import Model.Collections.MyDictionary;
import Model.Values.IValue;
import Model.Types.IType;

/**
 * Interface for all expressions
 */
public interface IExpression {
    IType typecheck(IDictionary<String, IType> typeEnv) throws CollectionsException, ExpressionEvaluationException;
    IValue eval(IDictionary<String, IValue> tbl, IHeap heap) throws CollectionsException, ExpressionEvaluationException;
}
