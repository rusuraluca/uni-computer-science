package Model.Statements;

import Exceptions.InterpreterException;
import Model.Collections.IDictionary;
import Model.Collections.IStack;
import Model.Expressions.Expression;
import Model.Expressions.RelationalExpression;
import Model.ProgramState.ProgramState;
import Model.Types.Type;

public class SwitchStatement implements Statement {
    Expression exp;
    Expression exp1;
    Expression exp2;
    Statement stmt;
    Statement stmt1;
    Statement stmt2;

    public SwitchStatement(Expression exp, Expression exp1, Expression exp2, Statement stmt, Statement stmt1, Statement stmt2) {
        this.exp = exp;
        this.exp1 = exp1;
        this.exp2 = exp2;
        this.stmt = stmt;
        this.stmt1 = stmt1;
        this.stmt2 = stmt2;
    }

    @Override
    public IDictionary<String, Type> typeCheck(IDictionary<String, Type> typeEnv) throws InterpreterException{
        Type typexp = exp.typeCheck(typeEnv);
        Type typexp1 = exp1.typeCheck(typeEnv);
        Type typexp2 = exp2.typeCheck(typeEnv);

        if (typexp.equals(typexp1) && typexp2.equals(typexp1)) {

            stmt.typeCheck(typeEnv.deepCopy());
            stmt1.typeCheck(typeEnv.deepCopy());
            stmt2.typeCheck(typeEnv.deepCopy());
            return typeEnv;
        } else
            throw new InterpreterException("The Expressions of Switch Statement were not of the same type!");
    }

    @Override
    public ProgramState execute(ProgramState state) throws InterpreterException {
        IStack<Statement> exeStack = state.getExeStack();
        Statement newStmt =
                new IfStatement(
                        new RelationalExpression("==", exp, exp1),
                        stmt,
                        new IfStatement(
                                new RelationalExpression("==", exp, exp2),
                                stmt1,
                                stmt2));
        exeStack.push(newStmt);
        state.setExeStack(exeStack);
        return null;
    }

    @Override
    public Statement deepCopy() {
        return new SwitchStatement(exp.deepCopy(), exp1.deepCopy(), exp2.deepCopy(), stmt.deepCopy(), stmt1.deepCopy(), stmt2.deepCopy());
    }

    public String toString() {
        return "\n(switch(" + exp.toString() + ")\n (case(" + exp1.toString()
                + "): " + stmt.toString() + ")\n(case (" + exp2.toString() + "): " +
                stmt1.toString() + ")\n (default: " + stmt2.toString() + "));\n";
    }
}
