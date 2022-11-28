package Model.Expressions;

import Model.Collections.Dictionary.IDictionary;
import Exceptions.ToyLanguageInterpreterException;
import Model.Types.Type;

import Model.Values.StringValue;
import Model.Values.Value;

public interface Expression {
    Expression deepCopy();
    Type typeCheck(IDictionary<String, Type> typeTable) throws ToyLanguageInterpreterException;
    Value evaluate(IDictionary<String, Value> symbolTable) throws ToyLanguageInterpreterException;}


