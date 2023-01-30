package Model.Statements;

import Exceptions.InterpreterException;
import Model.Expressions.Expression;
import Model.ProgramState.ProgramState;
import Model.Types.BoolType;
import Model.Types.Type;
import Model.Collections.IDictionary;
import Model.Collections.IStack;
import Model.Value.BoolValue;
import Model.Value.Value;

public class IfStatement implements Statement {
    Expression expression;
    Statement thenStatement;
    Statement elseStatement;

    public IfStatement(Expression expression, Statement thenStatement, Statement elseStatement) {
        this.expression = expression;
        this.thenStatement = thenStatement;
        this.elseStatement = elseStatement;
    }

    @Override
    public ProgramState execute(ProgramState state) throws InterpreterException {
        IStack<Statement> stack = state.getExeStack();
        Value result = this.expression.eval(state.getSymTable(), state.getHeap());
        if (result.getType().equals(new BoolType())){
            boolean condition = ((BoolValue) result).getValue();
            if(condition)
                stack.push(thenStatement);
            else
                stack.push(elseStatement);;
            state.setExeStack(stack);
        } else{
            throw new InterpreterException("The Expressions cannot be evaluated as true or false!");
        }
        return null;
    }

    @Override
    public IDictionary<String, Type> typeCheck(IDictionary<String, Type> typeEnv) throws InterpreterException {
        Type typeExpr = expression.typeCheck(typeEnv);
        if (typeExpr.equals(new BoolType())) {
            thenStatement.typeCheck(typeEnv.deepCopy());
            elseStatement.typeCheck(typeEnv.deepCopy());
            return typeEnv;
        } else
            throw new InterpreterException("The condition of IF does not have the Types Bool.");
    }

    @Override
    public Statement deepCopy() {
        return new IfStatement(expression.deepCopy(), thenStatement.deepCopy(), elseStatement.deepCopy());
    }

    @Override
    public String toString() {
        return String.format("if(%s){%s}else{%s}", expression.toString(), thenStatement.toString(), elseStatement.toString());
    }
}