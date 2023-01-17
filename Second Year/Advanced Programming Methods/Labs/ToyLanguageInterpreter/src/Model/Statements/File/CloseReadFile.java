package Model.Statements.File;

import Exceptions.ExpressionEvaluationException;
import Exceptions.StatementExecutionException;
import Exceptions.CollectionsException;
import Model.Expressions.IExpression;
import Model.ProgramState.ProgramState;
import Model.Statements.IStatement;
import Model.Types.IType;
import Model.Types.StringType;
import Model.Collections.IDictionary;
import Model.Values.IValue;
import Model.Values.StringValue;

import java.io.BufferedReader;
import java.io.IOException;

/**
 * Class that represents the statement that Closes a File
 */
public class CloseReadFile implements IStatement {
    private final IExpression expression;

    public CloseReadFile(IExpression expression) {
        this.expression = expression;
    }

    @Override
    public IDictionary<String, IType> typecheck(IDictionary<String, IType> typeEnv) throws CollectionsException, ExpressionEvaluationException{
        if (!expression.typecheck(typeEnv).equals(new StringType()))
            throw new ExpressionEvaluationException("CloseReadFile requires a string expression");
        return typeEnv;
    }

    @Override
    public ProgramState execute(ProgramState state) throws StatementExecutionException, ExpressionEvaluationException, CollectionsException {
        IValue value = expression.eval(state.getSymbolTable(), state.getHeap());

        if (!value.getType().equals(new StringType()))
            throw new StatementExecutionException(String.format("%s does not evaluate to StringValue", expression));

        StringValue fileName = (StringValue) value;
        IDictionary<String, BufferedReader> fileTable = state.getFileTable();

        if (!fileTable.containsKey(fileName.getValue()))
            throw new StatementExecutionException(String.format("%s is not present in the FileTable", value));

        BufferedReader br = fileTable.lookUp(fileName.getValue());

        try {
            br.close();
        } catch (IOException e) {
            throw new StatementExecutionException(String.format("Unexpected error in closing %s", value));
        }

        fileTable.remove(fileName.getValue());
        state.setFileTable(fileTable);

        return null;
    }

    @Override
    public String toString() {
        return String.format("closeReadFile(%s)", expression.toString());
    }
}