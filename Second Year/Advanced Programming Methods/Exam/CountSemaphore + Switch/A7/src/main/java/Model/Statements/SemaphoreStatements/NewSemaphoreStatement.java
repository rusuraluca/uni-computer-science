package Model.Statements.SemaphoreStatements;

import Exceptions.InterpreterException;
import Model.Collections.IDictionary;
import Model.Expressions.Expression;
import Model.Statements.Statement;
import Model.Types.Type;
import Model.Types.IntType;
import Model.Values.Value;
import Model.Values.IntValue;
import Model.ProgramState.ProgramState;

import javafx.util.Pair;

import java.util.Vector;

public class NewSemaphoreStatement implements Statement {
    private String variableName;
    private Expression expression;

    public NewSemaphoreStatement(String variableName, Expression expression) {
        this.variableName = variableName;
        this.expression = expression;
    }

    @Override
    public IDictionary<String, Type> typeCheck(IDictionary<String, Type> typeEnv) throws InterpreterException {
        try {
            Type varType = typeEnv.lookUp(variableName);
            if (varType == null)
                throw new InterpreterException(String.format("Variable '%s' has not been declared!", variableName));
            if (!varType.equals(new IntType()))
                throw new InterpreterException(String.format("Variable '%s' should have integer type!", variableName));
            if (!expression.typeCheck(typeEnv).equals(new IntType()))
                throw new InterpreterException(String.format("Expression '%s' should evaluate to an integer!", expression.toString()));
        } catch (InterpreterException e) {
            throw new InterpreterException(e.getMessage());
        }
        return typeEnv;
    }

    @Override
    public ProgramState execute(ProgramState state) throws InterpreterException {
        try {
            Value expressionValue = expression.eval(state.getSymTable(), state.getHeap());
            if (!expressionValue.getType().equals(new IntType()))
                throw new InterpreterException(String.format("Expression '%s' should evaluate to an integer!", expression.toString()));

            int expression_int = ((IntValue) expressionValue).getValue();
            ProgramState.semaphoreLock.lock();

            int new_location = state.getSemaphoreTable().put(new Pair<>(expression_int, new Vector<>()));
            Value variable_value = state.getSymTable().lookUp(variableName);
            if (variable_value == null)
                throw new InterpreterException(String.format("Variable '%s' has not been declared!", variableName));
            if (!variable_value.getType().equals(new IntType()))
                throw new InterpreterException(String.format("Variable '%s' should have integer type!", variableName));

            state.getSymTable().put(variableName, new IntValue(new_location));
            ProgramState.semaphoreLock.unlock();
        } catch (InterpreterException e) {
            throw new InterpreterException(e.getMessage());
        }
        return null;
    }

    @Override
    public Statement deepCopy() {
        return new NewSemaphoreStatement(variableName, expression);
    }

    @Override
    public String toString() {
        return String.format("newSemaphore(%s, %s)", variableName, expression.toString());
    }
}
