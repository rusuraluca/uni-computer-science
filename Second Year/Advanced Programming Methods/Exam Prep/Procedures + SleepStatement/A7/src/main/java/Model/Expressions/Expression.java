package Model.Expressions;


import Exceptions.InterpreterException;
import Model.Types.Type;
import Model.Collections.MyIDictionary;
import Model.Collections.MyIHeap;
import Model.Value.Value;

public interface Expression {
    Type typeCheck(MyIDictionary<String, Type> typeEnv) throws InterpreterException;
    Value eval(MyIDictionary<String, Value> table, MyIHeap heap) throws InterpreterException;
    Expression deepCopy();
}