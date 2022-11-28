package Model.Statements;

import Exceptions.ToyLanguageInterpreterException;
import Model.Collections.Dictionary.IDictionary;
import Model.Expressions.Expression;
import Model.ProgramState;
import Model.Statements.IStmt;
import Model.Types.StringType;
import Model.Types.Type;
import Model.Values.StringValue;
import Model.Values.Value;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;


public class OpenReadFile implements IStmt {
    private final Expression expression;

    public OpenReadFile(Expression expression) { this.expression = expression; }

    @Override
    public IStmt deepCopy(){
        return new CloseReadFile(expression.deepCopy());
    }

    @Override
    public IDictionary<String, Type> typeCheck(IDictionary<String, Type> typeTable) throws ToyLanguageInterpreterException {
        if (!expression.typeCheck(typeTable).equals(new StringType()))
            throw new ToyLanguageInterpreterException("OpenReadFile requires a string expression");
        return typeTable;
    }

    @Override
    public ProgramState execute(ProgramState state) throws ToyLanguageInterpreterException {
        Value value = expression.evaluate(state.getSymbolTable());

        if (!value.getType().equals(new StringType()))
            throw new ToyLanguageInterpreterException(String.format("%s does not evaluate to StringValue!", expression));

        StringValue fileName = (StringValue) value;

        IDictionary<String, BufferedReader> fileTable = state.getFileTable();

        if (fileTable.containsKey(fileName.getValue()))
            throw new ToyLanguageInterpreterException(String.format("%s is already opened", value));

        BufferedReader br;

        try {
            br =  new BufferedReader(new FileReader(fileName.getValue()));
        } catch (IOException e) {
            throw new ToyLanguageInterpreterException(String.format("Could not be opened %s", value));
        }

        fileTable.put(fileName.getValue(), br);

        return null;
    }

    @Override
    public String toString() {
        return String.format("OpenReadFile{%s}", expression);
    }

}
