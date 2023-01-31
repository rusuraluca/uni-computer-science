package Model.ProgramState;

import Exceptions.InterpreterException;
import Model.Statements.Statement;
import Model.Collections.*;
import Model.Values.Value;

import java.io.BufferedReader;
import java.util.List;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

public class ProgramState {
    private IStack<Statement> exeStack;
    private IDictionary<String, Value> symTable;
    private IList<Value> out;
    private IDictionary<String, BufferedReader> fileTable;
    private IHeap heap;
    private ILockTable lockTable;
    private ISemaphoreTable semaphoreTable;
    static public Lock semaphoreLock = new ReentrantLock();
    private Statement originalProgram;
    private int id;
    private static int lastId = 0;

    public ProgramState(IStack<Statement> stack, IDictionary<String,Value> symTable, IList<Value> out,
                        IDictionary<String, BufferedReader> fileTable, IHeap heap,
                        ILockTable lockTable, ISemaphoreTable semaphoreTable, Statement program) {
        this.exeStack = stack;
        this.symTable = symTable;
        this.out = out;
        this.fileTable = fileTable;
        this.heap = heap;
        this.lockTable = lockTable;
        this.semaphoreTable = semaphoreTable;
        this.originalProgram = program.deepCopy();
        this.exeStack.push(this.originalProgram);
        this.id = setId();
    }

    public ProgramState(IStack<Statement> stack, IDictionary<String,Value> symTable, IList<Value> out,
                        IDictionary<String, BufferedReader> fileTable, IHeap heap, ILockTable lockTable,
                        ISemaphoreTable semaphoreTable) {
        this.exeStack = stack;
        this.symTable = symTable;
        this.out = out;
        this.fileTable = fileTable;
        this.heap = heap;
        this.lockTable = lockTable;
        this.semaphoreTable = semaphoreTable;
        this.id = setId();
    }

    public synchronized int setId() {
        lastId++;
        return lastId;
    }

    public int getId() {
        return this.id;
    }

    public void setExeStack(IStack<Statement> newStack) {
        this.exeStack = newStack;
    }

    public void setSymTable(IDictionary<String, Value> newSymTable) {
        this.symTable = newSymTable;
    }

    public void setOut(IList<Value> newOut) {
        this.out = newOut;
    }

    public void setFileTable(IDictionary<String, BufferedReader> newFileTable) {
        this.fileTable = newFileTable;
    }

    public void setHeap(IHeap newHeap) {
        this.heap = newHeap;
    }

    public void setLockTable(ILockTable newLockTable) {
        this.lockTable = newLockTable;
    }
    public void setSemaphoreTable(ISemaphoreTable semaphoreTable) {
        this.semaphoreTable = semaphoreTable;
    }

    public IStack<Statement> getExeStack() {
        return exeStack;
    }

    public IDictionary<String, Value> getSymTable() {
        return symTable;
    }

    public IList<Value> getOut() {
        return out;
    }

    public IDictionary<String, BufferedReader> getFileTable() {
        return fileTable;
    }

    public IHeap getHeap() {
        return heap;
    }

    public ILockTable getLockTable() {
        return lockTable;
    }

    public ISemaphoreTable getSemaphoreTable() {
        return semaphoreTable;
    }

    public boolean isNotCompleted() {
        return exeStack.isEmpty();
    }

    public ProgramState oneStep() throws InterpreterException {
        if (exeStack.isEmpty())
            throw new InterpreterException("Program state stack is empty!");
        Statement currentStatement = exeStack.pop();
        return currentStatement.execute(this);
    }

    public String exeStackToString() {
        StringBuilder exeStackStringBuilder = new StringBuilder();
        List<Statement> stack = exeStack.getReversed();
        for (Statement statement: stack) {
            exeStackStringBuilder.append(statement.toString()).append("\n");
        }
        return exeStackStringBuilder.toString();
    }

    public String symTableToString() throws InterpreterException {
        StringBuilder symTableStringBuilder = new StringBuilder();
        for (String key: symTable.keySet()) {
            symTableStringBuilder.append(String.format("%s -> %s\n", key, symTable.lookUp(key).toString()));
        }
        return symTableStringBuilder.toString();
    }

    public String outToString() {
        StringBuilder outStringBuilder = new StringBuilder();
        for (Value elem: out.getList()) {
            outStringBuilder.append(String.format("%s\n", elem.toString()));
        }
        return outStringBuilder.toString();
    }

    public String fileTableToString() {
        StringBuilder fileTableStringBuilder = new StringBuilder();
        for (String key: fileTable.keySet()) {
            fileTableStringBuilder.append(String.format("%s\n", key));
        }
        return fileTableStringBuilder.toString();
    }

    public String heapToString() throws InterpreterException {
        StringBuilder heapStringBuilder = new StringBuilder();
        for (int key: heap.keySet()) {
            heapStringBuilder.append(String.format("%d -> %s\n", key, heap.get(key)));
        }
        return heapStringBuilder.toString();
    }

    public String lockTableToString() throws InterpreterException {
        StringBuilder lockTableStringBuilder = new StringBuilder();
        for (int key: lockTable.keySet()) {
            lockTableStringBuilder.append(String.format("%d -> %d\n", key, lockTable.get(key)));
        }
        return lockTableStringBuilder.toString();
    }

    public String semaphoreTableToString() throws InterpreterException {
        StringBuilder semaphoreTableStringBuilder = new StringBuilder();
        for (int key: semaphoreTable.keySet()) {
            semaphoreTableStringBuilder.append(String.format("%d -> %d; %s; %d\n", key, semaphoreTable.lookUp(key).getKey(), semaphoreTable.lookUp(key).getValue().getKey().toString(), semaphoreTable.lookUp(key).getValue().getValue()));
        }
        return semaphoreTableStringBuilder.toString();
    }

    @Override
    public String toString() {
        return "Id: " + id + "\nExecution stack: \n" + exeStack.getReversed() + "\nSymbol table: \n" + symTable.toString() + "\nOutput list: \n" + out.toString() + "\nFile table:\n" + fileTable.toString() + "\nHeap memory:\n" + heap.toString() + "\nLock Table:\n" + lockTable.toString() + "\nSemaphore Table:\n" + semaphoreTable.toString() + "\n";
    }

    public String programStateToString() throws InterpreterException {
        return "Id: " + id + "\nExecution stack: \n" + exeStackToString() + "Symbol table: \n" + symTableToString() + "Output list: \n" + outToString() + "File table:\n" + fileTableToString() + "Heap memory:\n" + heapToString() + "Lock Table:\n" + lockTableToString() + "Semaphore Table:\n" + semaphoreTableToString();
    }
}
