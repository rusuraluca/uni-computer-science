package Model.Statements;

import Model.Collections.Dictionary.IDictionary;
import Exceptions.IncompatibleTypesExceptions;
import Exceptions.ToyLanguageInterpreterException;
import Model.Types.Type;
import Model.Types.BoolType;
import Model.Values.Value;
import Model.Values.BoolValue;
import Model.Expressions.Expression;
import Model.ProgramState;

public class IfStmt implements IStmt {
    IStmt ifStmt;
    IStmt elseStmt;
    Expression expr;

    public IfStmt(Expression expr, IStmt ifStmt, IStmt elseStmt) {
        this.expr = expr;
        this.ifStmt = ifStmt;
        this.elseStmt= elseStmt;
    }

    public IStmt getIfStmt() { return ifStmt; }
    public void setIfStmt(IStmt ifStmt) { this.ifStmt = ifStmt; }

    public IStmt getElseStmt() { return elseStmt; }
    public void setElseStmt(IStmt elseStmt) { this.elseStmt = elseStmt; }

    public Expression getExpr() { return expr; }
    public void setExpr(Expression expr) { this.expr = expr;}

    @Override
    public IStmt deepCopy(){
        return new IfStmt(expr.deepCopy(), ifStmt.deepCopy(), elseStmt.deepCopy());
    }

    @Override
    public IDictionary<String, Type> typeCheck(IDictionary<String, Type> typeTable) throws ToyLanguageInterpreterException {
        if (!expr.typeCheck(typeTable).equals(new BoolType()))
            throw new IncompatibleTypesExceptions("The condition of If Statement doesn't have the BoolType!");

        ifStmt.typeCheck(typeTable.copy());
        elseStmt.typeCheck(typeTable.copy());

        return typeTable;
    }

    @Override
    public ProgramState execute(ProgramState state) throws ToyLanguageInterpreterException {
        Value value = expr.evaluate(state.getSymbolTable());

        if (value.getType().equals(new BoolType())) {
            BoolValue condition = (BoolValue)value;
            if (condition.getValue())
                state.getExecutionStack().push(ifStmt);
            else
                state.getExecutionStack().push(elseStmt);

            return state;
        }
        throw new IncompatibleTypesExceptions(String.format("%s not of BoolType inside If Statement!", value.toString()));
    }

    @Override
    public String toString(){ return "if(" + expr.toString() + ") then(" +ifStmt.toString() + ")else(" + elseStmt.toString() + ")"; }
}
