package Model.Statements;

import Exceptions.ToyLanguageInterpreterException;
import Model.Collections.Dictionary.IDictionary;
import Model.Expressions.Expression;
import Model.ProgramState;
import Model.Statements.IStmt;
import Model.Types.IntType;
import Model.Types.StringType;
import Model.Types.Type;
import Model.Values.IntValue;
import Model.Values.StringValue;
import Model.Values.Value;

import java.io.BufferedReader;
import java.io.IOException;


public class ReadFile implements IStmt {
    private final Expression expression;
    private final String varName;

    public ReadFile(Expression expression, String varName) {
        this.expression = expression;
        this.varName = varName;
    }

    @Override
    public IStmt deepCopy(){
        return new ReadFile(expression.deepCopy(), varName);
    }

    @Override
    public IDictionary<String, Type> typeCheck(IDictionary<String, Type> typeTable) throws ToyLanguageInterpreterException {
        if (!expression.typeCheck(typeTable).equals(new StringType()))
            throw new ToyLanguageInterpreterException("ReadFile requires a string as expression parameter");

        if (!typeTable.get(varName).equals(new IntType()))
            throw new ToyLanguageInterpreterException("ReadFile requires an int as variable parameter");
        return typeTable;
    }

    @Override
    public ProgramState execute(ProgramState state) throws ToyLanguageInterpreterException {
        IDictionary<String, Value> symTable = state.getSymbolTable();

        IDictionary<String, BufferedReader> fileTable = state.getFileTable();

        if (!symTable.containsKey(varName))
            throw new ToyLanguageInterpreterException(String.format("%s is not present in the symTable", varName));
        Value value = symTable.get(varName);

        if (!value.getType().equals(new IntType()))
            throw new ToyLanguageInterpreterException(String.format("%s is not of type IntType", value));
        value = expression.evaluate(symTable);

        if (!value.getType().equals(new StringType()))
            throw new ToyLanguageInterpreterException(String.format("%s does not evaluate to StringType", value));
        StringValue castValue = (StringValue) value;

        if (!fileTable.containsKey(castValue.getValue()))
            throw new ToyLanguageInterpreterException(String.format("The fileTable does not contain %s", castValue));

        BufferedReader br = fileTable.get(castValue.getValue());

        try {
            String line = br.readLine();
            if (line == null)
                line = "0";
            symTable.put(varName, new IntValue(Integer.parseInt(line)));
        } catch (IOException e) {
            throw new ToyLanguageInterpreterException(String.format("Could not read from file %s", castValue));
        }

        return null;
    }

    @Override
    public String toString() {
        return String.format("ReadFile{%s, %s}", expression, varName);
    }

}
