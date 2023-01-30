package Model.Statements;

import Exceptions.InterpreterException;
import Model.Expressions.Expression;
import Model.ProgramState.ProgramState;
import Model.Types.Type;
import Model.Collections.MyIDictionary;
import Model.Value.Value;

public class AssignmentStatement implements Statement {
    private final String key;
    private final Expression expression;

    public AssignmentStatement(String key, Expression expression) {
        this.key = key;
        this.expression = expression;
    }

    @Override
    public ProgramState execute(ProgramState state) throws InterpreterException {
        MyIDictionary<String, Value> symbolTable = state.getSymTable();

        if (symbolTable.isDefined(key)) {
            Value value = expression.eval(symbolTable, state.getHeap());
            Type typeId = (symbolTable.lookUp(key)).getType();
            if (value.getType().equals(typeId)) {
                symbolTable.update(key, value);
            } else {
                throw new InterpreterException("Declared Types of variable " + key + " and Types of the assigned Expressions do not match.");
            }
        } else {
            throw new InterpreterException("The used variable " + key + " was not declared before.");
        }
        //state.setSymTable(symbolTable);
        return null;
    }

    @Override
    public MyIDictionary<String, Type> typeCheck(MyIDictionary<String, Type> typeEnv) throws InterpreterException {
        Type typeVar = typeEnv.lookUp(key);
        Type typeExpr = expression.typeCheck(typeEnv);
        if (typeVar.equals(typeExpr))
            return typeEnv;
        else
            throw new InterpreterException("Assignment: right hand side and left hand side have different types.");
    }

    @Override
    public Statement deepCopy() {
        return new AssignmentStatement(key, expression.deepCopy());
    }

    @Override
    public String toString() {
        return String.format("%s = %s", key, expression.toString());
    }
}