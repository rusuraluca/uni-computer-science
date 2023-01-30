package Model.Statements;

import Exceptions.InterpreterException;
import Model.ProgramState.ProgramState;
import Model.Types.IntType;
import Model.Types.Type;
import Model.Collections.MyIDictionary;
import Model.Collections.MyILockTable;
import Model.Value.IntValue;
import Model.Value.Value;

import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

public class LockStatement implements Statement {
    private final String var;
    private static final Lock lock = new ReentrantLock();

    public LockStatement(String var) {
        this.var = var;
    }

    @Override
    public ProgramState execute(ProgramState state) throws InterpreterException {
        lock.lock();
        MyIDictionary<String, Value> symTable = state.getSymTable();
        MyILockTable lockTable = state.getLockTable();
        if (symTable.isDefined(var)) {
            if (symTable.lookUp(var).getType().equals(new IntType())) {
                IntValue fi = (IntValue) symTable.lookUp(var);
                int foundIndex = fi.getValue();
                if (lockTable.containsKey(foundIndex)) {
                    if (lockTable.get(foundIndex) == -1) {
                        lockTable.update(foundIndex, state.getId());
                        state.setLockTable(lockTable);
                    } else {
                        state.getExeStack().push(this);
                    }
                } else {
                    throw new InterpreterException("Index is not in the lock table!");
                }
            } else {
                throw new InterpreterException("Var is not of Types int!");
            }
        } else {
            throw new InterpreterException("Variable not defined!");
        }
        lock.unlock();
        return null;
    }

    @Override
    public MyIDictionary<String, Type> typeCheck(MyIDictionary<String, Type> typeEnv) throws InterpreterException {
        if (typeEnv.lookUp(var).equals(new IntType())) {
            return typeEnv;
        } else {
            throw new InterpreterException("Var is not of int Types!");
        }
    }

    @Override
    public Statement deepCopy() {
        return new LockStatement(var);
    }

    @Override
    public String toString() {
        return String.format("lock(%s)", var);
    }
}
