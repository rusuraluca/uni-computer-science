package Model.Statements;

import Exceptions.InterpreterException;
import Model.Expressions.Expression;
import Model.ProgramState.ProgramState;
import Model.Types.IntType;
import Model.Types.StringType;
import Model.Types.Type;
import Model.Collections.IDictionary;
import Model.Values.IntValue;
import Model.Values.StringValue;
import Model.Values.Value;

import java.io.BufferedReader;
import java.io.IOException;

public class ReadFile implements Statement {
    private final Expression expression;
    private final String varName;

    public ReadFile(Expression expression, String varName) {
        this.expression = expression;
        this.varName = varName;
    }
    @Override
    public ProgramState execute(ProgramState state) throws InterpreterException {
        IDictionary<String, Value> symTable = state.getSymTable();
        IDictionary<String, BufferedReader> fileTable = state.getFileTable();

        if (symTable.isDefined(varName)) {
            Value value = symTable.lookUp(varName);
            if (value.getType().equals(new IntType())) {
                Value fileNameValue = expression.eval(symTable, state.getHeap());
                if (fileNameValue.getType().equals(new StringType())) {
                    StringValue castValue = (StringValue)fileNameValue;
                    if (fileTable.isDefined(castValue.getValue())) {
                        BufferedReader br = fileTable.lookUp(castValue.getValue());
                        try {
                            String line = br.readLine();
                            if (line == null)
                                line = "0";
                            symTable.put(varName, new IntValue(Integer.parseInt(line)));
                        } catch (IOException e) {
                            throw new InterpreterException(String.format("Could not read from file %s", castValue));
                        }
                    } else {
                        throw new InterpreterException(String.format("The file table does not contain %s", castValue));
                    }
                } else {
                    throw new InterpreterException(String.format("%s does not evaluate to StringType", value));
                }
            } else {
                throw new InterpreterException(String.format("%s is not of Types IntType", value));
            }
        } else {
            throw new InterpreterException(String.format("%s is not present in the symTable.", varName));
        }
        return null;
    }

    @Override
    public IDictionary<String, Type> typeCheck(IDictionary<String, Type> typeEnv) throws InterpreterException {
        if (expression.typeCheck(typeEnv).equals(new StringType()))
            if (typeEnv.lookUp(varName).equals(new IntType()))
                return typeEnv;
            else
                throw new InterpreterException("ReadFile requires an int as its variable parameter.");
        else
            throw new InterpreterException("ReadFile requires a string as es Expressions parameter.");
    }

    @Override
    public Statement deepCopy() {
        return new ReadFile(expression.deepCopy(), varName);
    }

    @Override
    public String toString() {
        return String.format("ReadFile(%s, %s)", expression.toString(), varName);
    }
}