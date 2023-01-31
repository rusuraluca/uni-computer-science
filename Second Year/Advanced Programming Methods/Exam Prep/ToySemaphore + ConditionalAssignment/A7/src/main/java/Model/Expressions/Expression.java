package Model.Expressions;


import Exceptions.InterpreterException;
import Model.Types.Type;
import Model.Collections.IDictionary;
import Model.Collections.IHeap;
import Model.Values.Value;

public interface Expression {
    Type typeCheck(IDictionary<String, Type> typeEnv) throws InterpreterException;
    Value eval(IDictionary<String, Value> table, IHeap heap) throws InterpreterException;
    Expression deepCopy();
}