package Model.Statements;

import Exceptions.InterpreterException;
import Model.Collections.IDictionary;
import Model.Expressions.Expression;
import Model.ProgramState.ProgramState;
import Model.Types.IntType;
import Model.Types.Type;
import Model.Value.IntValue;
import Model.Value.Value;
import javafx.util.Pair;

import java.util.Vector;

public class NewBarrierStatement implements Statement{
    public String variableName;
    public Expression expression;

    public NewBarrierStatement(String variableName, Expression expression) {
        this.variableName = variableName;
        this.expression = expression;
    }
    public String getVariableName() {
        return variableName;
    }
    public void setVariableName(String variableName) {
        this.variableName = variableName;
    }
    public Expression getExpression() {
        return expression;
    }
    public void setExpression(Expression expression) {
        this.expression = expression;
    }

    @Override
    public IDictionary<String, Type> typeCheck(IDictionary<String, Type> typeTable) throws InterpreterException {
        try {
            Type expressionType = expression.typeCheck(typeTable);
            if (!expressionType.equals(new IntType()))
                throw new InterpreterException(String.format("Expression %s should evaluate to an integer type!", expression.toString()));

            Type variableType = typeTable.lookUp(variableName);
            if (variableType == null)
                throw new InterpreterException(String.format("Variable %s has not been declared!", variableName));
            if (!variableType.equals(new IntType()))
                throw new InterpreterException(String.format("Variable %s should be of integer type!", variableName));

        } catch (InterpreterException e) {
            throw new InterpreterException(e.getMessage());
        }

        return typeTable;
    }

    @Override
    public ProgramState execute(ProgramState state) throws InterpreterException {
        try {
            Value expressionEval = expression.eval(state.getSymTable(), state.getHeap());
            if (!expressionEval.getType().equals(new IntType()))
                throw new InterpreterException(String.format("Expression %s should evaluate to an integer type!", expression.toString()));

            int expressionValue = ((IntValue) expressionEval).getValue();
            int newLocation = state.getBarrierTable().put(new Pair<>(expressionValue, new Vector<>()));

            Value variableValue = state.getSymTable().lookUp(variableName);
            if (variableValue == null)
                throw new InterpreterException(String.format("Variable %s has not been declared!", variableName));
            if (!variableValue.getType().equals(new IntType()))
                throw new InterpreterException(String.format("Variable %s should be of integer type!", variableName));

            state.getSymTable().update(variableName, new IntValue(newLocation));

        } catch (InterpreterException e) {
            throw new InterpreterException(e.getMessage());
        }

        return null;
    }
    @Override
    public Statement deepCopy() {
        return new NewBarrierStatement(variableName, expression);
    }

    @Override
    public String toString() {
        return String.format("newBarrier(%s, %s)", variableName, expression.toString());
    }
}
