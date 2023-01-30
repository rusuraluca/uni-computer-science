package Model.Statements;

import Exceptions.InterpreterException;
import Model.Expressions.Expression;
import Model.Expressions.RelationalExpression;
import Model.Expressions.VariableExpression;
import Model.ProgramState.ProgramState;
import Model.Types.IntType;
import Model.Types.Type;
import Model.Collections.MyIDictionary;
import Model.Collections.MyIStack;

public class ForStatement implements Statement {
    private final String variable;
    private final Expression expression1;
    private final Expression expression2;
    private final Expression expression3;
    private final Statement statement;

    public ForStatement(String variable, Expression expression1, Expression expression2, Expression expression3, Statement statement) {
        this.variable = variable;
        this.expression1 = expression1;
        this.expression2 = expression2;
        this.expression3 = expression3;
        this.statement = statement;
    }

    @Override
    public ProgramState execute(ProgramState state) throws InterpreterException {
        MyIStack<Statement> exeStack = state.getExeStack();
        Statement toWhile = new CompoundStatement(new AssignmentStatement("v", expression1),
                new WhileStatement(new RelationalExpression("<", new VariableExpression("v"), expression2),
                        new CompoundStatement(statement, new AssignmentStatement("v", expression3))));
        exeStack.push(toWhile);
        state.setExeStack(exeStack);
        return null;
    }

    @Override
    public MyIDictionary<String, Type> typeCheck(MyIDictionary<String, Type> typeEnv) throws InterpreterException {
        Type type1 = expression1.typeCheck(typeEnv);
        Type type2 = expression2.typeCheck(typeEnv);
        Type type3 = expression3.typeCheck(typeEnv);

        if (type1.equals(new IntType()) && type2.equals(new IntType()) && type3.equals(new IntType()))
            return typeEnv;
        else
            throw new InterpreterException("The for Statements is invalid!");
    }

    @Override
    public Statement deepCopy() {
        return new ForStatement(variable, expression1.deepCopy(), expression2.deepCopy(), expression3.deepCopy(), statement.deepCopy());
    }

    @Override
    public String toString() {
        return String.format("for(%s=%s; %s<%s; %s=%s) {%s}", variable, expression1, variable, expression2, variable, expression3, statement);
    }
}
