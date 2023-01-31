package Model.Statements;

import Exceptions.InterpreterException;
import Model.Collections.IDictionary;
import Model.Collections.IStack;
import Model.Expressions.Expression;
import Model.Expressions.NotExpression;
import Model.ProgramState.ProgramState;
import Model.Types.BoolType;
import Model.Types.Type;

public class RepeatUntilStatement implements Statement {
    Statement statement;
    Expression expression;

    public RepeatUntilStatement(Statement statement, Expression expression) {
        this.statement = statement;
        this.expression = expression;
    }

    @Override
    public ProgramState execute(ProgramState state) throws InterpreterException {
        IStack<Statement> exeStack = state.getExeStack();
        Statement whileStatement = new CompoundStatement(statement, new WhileStatement(new NotExpression(expression), statement));
        exeStack.push(whileStatement);
        return null;
    }

    @Override
    public IDictionary<String, Type> typeCheck(IDictionary<String, Type> typeEnv) throws InterpreterException {
        Type expressionType = expression.typeCheck(typeEnv);
        statement.typeCheck(typeEnv);
        if (expressionType.equals(new BoolType())) {
            statement.typeCheck(typeEnv.deepCopy());
            return typeEnv;
        } else
            throw new InterpreterException("The Expression of Repeat Statement was not Boolean");
    }

    @Override
    public Statement deepCopy() {
        return new RepeatUntilStatement(statement.deepCopy(), expression.deepCopy());
    }

    @Override
    public String toString() {
        return String.format("repeat(%s) until %s", statement.toString(), expression.toString());
    }
}
