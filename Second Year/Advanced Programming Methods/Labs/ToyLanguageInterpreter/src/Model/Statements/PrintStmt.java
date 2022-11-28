package Model.Statements;

import Model.Collections.Dictionary.IDictionary;
import Exceptions.ToyLanguageInterpreterException;
import Model.Types.Type;
import Model.Expressions.Expression;
import Model.ProgramState;

public class PrintStmt implements IStmt {
    private Expression expr;

    public PrintStmt(Expression expr) {
        this.expr = expr;
    }

    public Expression getExpr() {
        return expr;
    }
    public void setExpr(Expression expr) {
        this.expr = expr;
    }

    @Override
    public IStmt deepCopy(){
        return new PrintStmt(expr.deepCopy());
    }

    @Override
    public IDictionary<String, Type> typeCheck(IDictionary<String, Type> typeTable) throws ToyLanguageInterpreterException {
        expr.typeCheck(typeTable);
        return typeTable;
    }

    @Override
    public ProgramState execute(ProgramState state) throws ToyLanguageInterpreterException{
        state.getOutputList().add(expr.evaluate(state.getSymbolTable()).toString());
        return state;
    }

    @Override
    public String toString() { return "print(" + expr.toString() + ")"; }
}
