package Model.Statements;

import Exceptions.InterpreterException;
import Model.Collections.IDictionary;
import Model.Expressions.Expression;
import Model.ProgramState.ProgramState;
import Model.Types.BoolType;
import Model.Types.Type;
import Model.Value.BoolValue;
import Model.Value.Value;

public class ConditionalAssignmentStatement implements Statement {
    private final String key;
    private final Expression exp1;
    private final Expression exp2;
    private final Expression exp3;

    public ConditionalAssignmentStatement(String key, Expression exp1, Expression exp2, Expression exp3) {
        this.key = key;
        this.exp1 = exp1;
        this.exp2 = exp2;
        this.exp3 = exp3;
    }

    @Override
    public ProgramState execute(ProgramState state) throws InterpreterException {
        IDictionary<String, Value> symbolTable = state.getSymTable();
        if (symbolTable.isDefined(key)) {
            Value value1 = exp1.eval(symbolTable, state.getHeap());
            Value value2 = exp2.eval(symbolTable, state.getHeap());
            Value value3 = exp3.eval(symbolTable, state.getHeap());
            Type typeId = (symbolTable.lookUp(key)).getType();
            if (value2.getType().equals(typeId) && value3.getType().equals(typeId)) {
                if (value1.getType().equals(new BoolType())) {
                    boolean condition = ((BoolValue) value1).getValue();
                    if (condition)
                        symbolTable.update(key, value2);
                    else
                        symbolTable.update(key, value3);
                } else {
                    throw new InterpreterException("The Expression of Conditional Assignment Statement has to be of bool type!");
                }
            } else {
                throw new InterpreterException("Declared Types of variable " + key + " and Types of the assigned Expressions do not match.");
            }
        } else {
            throw new InterpreterException("The used variable " + key + " was not declared before.");
        }
        state.setSymTable(symbolTable);
        return null;
    }

    @Override
    public IDictionary<String, Type> typeCheck(IDictionary<String, Type> typeEnv) throws InterpreterException {
        Type typeVar = typeEnv.lookUp(key);
        Type typeExpr2 = exp2.typeCheck(typeEnv);
        Type typeExpr3 = exp3.typeCheck(typeEnv);
        if (typeVar.equals(typeExpr2) && typeVar.equals(typeExpr3)){
            Type typeExpr1 = exp1.typeCheck(typeEnv);
            if (typeExpr1.equals(new BoolType())) {
                return typeEnv;
            }
            else
                throw new InterpreterException("The Expression of Conditional Assignment Statement has to be of bool type!");
        }
        else
            throw new InterpreterException("Conditional Assignment Statement: right hand side and left hand side have different types.");
    }

    @Override
    public Statement deepCopy() {
        return new ConditionalAssignmentStatement(key, exp1.deepCopy(), exp2.deepCopy(), exp3.deepCopy());
    }

    @Override
    public String toString() {
        return String.format("%s = %s ? %s : %s", key, exp1, exp2, exp3);
    }
}
