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
    private Expression expression1;
    private Expression expression2;

    public NewSemaphoreStatement(String variableName, Expression expression1, Expression expression2) {
        this.variableName = variableName;
        this.expression1 = expression1;
        this.expression2 = expression2;
    }

    @Override
    public IDictionary<String, Type> typeCheck(IDictionary<String, Type> typeEnv) throws InterpreterException {
        try {
            Type varType = typeEnv.lookUp(variableName);
            if (varType == null)
                throw new InterpreterException(String.format("Variable '%s' has not been declared!", variableName));
            if (!varType.equals(new IntType()))
                throw new InterpreterException(String.format("Variable '%s' should have integer type!", variableName));
            if (!expression1.typeCheck(typeEnv).equals(new IntType()))
                throw new InterpreterException(String.format("Expression '%s' should evaluate to an integer!", expression1.toString()));
            if (!expression2.typeCheck(typeEnv).equals(new IntType()))
                throw new InterpreterException(String.format("Expression '%s' should evaluate to an integer!", expression2.toString()));
        } catch (InterpreterException e) {
            throw new InterpreterException(e.getMessage());
        }
        return typeEnv;
    }

    @Override
    public ProgramState execute(ProgramState state) throws InterpreterException {
        try {
            Value expression1Value = expression1.eval(state.getSymTable(), state.getHeap());
            Value expression2Value = expression2.eval(state.getSymTable(), state.getHeap());

            if (!expression1Value.getType().equals(new IntType()))
                throw new InterpreterException(String.format("Expression '%s' should evaluate to an integer!", expression1.toString()));
            if (!expression2Value.getType().equals(new IntType()))
                throw new InterpreterException(String.format("Expression '%s' should evaluate to an integer!", expression2.toString()));

            int value1 = ((IntValue) expression1Value).getValue();
            int value2 = ((IntValue) expression2Value).getValue();

            int newLocation = state.getSemaphoreTable().getFirstFreeLocation();
            state.getSemaphoreTable().put(newLocation, new Pair<>(value1, new Pair<>(new Vector<>(), value2)));
            ProgramState.semaphoreLock.lock();

            Value variableValue = state.getSymTable().lookUp(variableName);
            if (variableValue == null) {
                ProgramState.semaphoreLock.unlock();
                throw new InterpreterException(String.format("Variable '%s' has not been declared!", variableName));
            }
            if (!variableValue.getType().equals(new IntType())) {
                ProgramState.semaphoreLock.unlock();
                throw new InterpreterException(String.format("Variable '%s' should have integer type!", variableName));
            }
            state.getSymTable().put(variableName, new IntValue(newLocation));
            ProgramState.semaphoreLock.unlock();
            return null;
        } catch (InterpreterException e) {
            throw new InterpreterException(e.getMessage());
        }
    }

    @Override
    public Statement deepCopy() {
        return new NewSemaphoreStatement(variableName, expression1, expression2);
    }

    @Override
    public String toString() {
        return String.format("newSemaphore(%s, %s, %s)", variableName, expression1.toString(), expression2.toString());
    }
}
