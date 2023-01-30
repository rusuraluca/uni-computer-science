package Model.ProgramState;

import Exceptions.InterpreterException;
import Model.Statements.Statement;
import Model.Collections.*;
import Model.Value.Value;

import java.io.BufferedReader;
import java.util.List;

public class ProgramState {
    private MyIStack<Statement> exeStack;
    // private MyIDictionary<String, Value> symTable;
    private MyIStack<MyIDictionary <String, Value>> symTables;
    private MyIList<Value> out;
    private MyIDictionary<String, BufferedReader> fileTable;
    private MyIHeap heap;
    private MyILockTable lockTable;
    private MyIProcedureTable procedureTable;
    private Statement originalProgram;
    private int id;
    private static int lastId = 0;

    public ProgramState(MyIStack<Statement> stack, MyIDictionary <String, Value> symTable, MyIList<Value> out,
                        MyIDictionary<String, BufferedReader> fileTable, MyIHeap heap,
                        MyILockTable lockTable, MyIProcedureTable procedureTable, Statement statement) {
        this.exeStack = stack;
        this.symTables = new MySymbolTablesStack();
        this.symTables.push(symTable);
        this.out = out;
        this.fileTable = fileTable;
        this.heap = heap;
        this.lockTable = lockTable;
        this.procedureTable = procedureTable;
        this.originalProgram = statement.deepCopy();
        this.exeStack.push(statement);
        this.id = setId();
    }

    public ProgramState(MyIStack<Statement> stack, MyIDictionary <String, Value> symTable, MyIList<Value> out,
                        MyIDictionary<String, BufferedReader> fileTable, MyIHeap heap, MyILockTable lockTable,
                        MyIProcedureTable procedureTable) {
        this.exeStack = stack;
        this.symTables = new MySymbolTablesStack();
        this.symTables.push(symTable);
        this.out = out;
        this.fileTable = fileTable;
        this.heap = heap;
        this.lockTable = lockTable;
        this.procedureTable = procedureTable;
        this.id = setId();
    }

    public synchronized int setId() {
        lastId++;
        return lastId;
    }

    public int getId() {
        return this.id;
    }

    public void setExeStack(MyIStack<Statement> newStack) {
        this.exeStack = newStack;
    }

    // public void setSymTable(MyIDictionary<String, Value> newSymTable) { this.symTable = newSymTable; }

    public void setOut(MyIList<Value> newOut) {
        this.out = newOut;
    }

    public void setFileTable(MyIDictionary<String, BufferedReader> newFileTable) {
        this.fileTable = newFileTable;
    }

    public void setHeap(MyIHeap newHeap) {
        this.heap = newHeap;
    }

    public void setLockTable(MyILockTable newLockTable) {
        this.lockTable = newLockTable;
    }

    public void setProcedureTable(MyIProcedureTable procedureTable) {
        this.procedureTable = procedureTable;
    }

    public MyIStack<Statement> getExeStack() {
        return exeStack;
    }

    // public MyIDictionary<String, Value> getSymTable() { return symTable; }

    public MyIDictionary<String, Value> getSymTable() {
        return symTables.peek();
    }

    public MyIStack<MyIDictionary<String, Value>> getAllSymTables() {
        return symTables;
    }

    public MyIList<Value> getOut() {
        return out;
    }

    public MyIDictionary<String, BufferedReader> getFileTable() {
        return fileTable;
    }

    public MyIHeap getHeap() {
        return heap;
    }

    public MyILockTable getLockTable() {
        return lockTable;
    }

    public MyIProcedureTable getProcedureTable() {
        return procedureTable;
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

    /*
    public String symTableToString() throws InterpreterException {
        StringBuilder symTableStringBuilder = new StringBuilder();
        for (String key: symTable.keySet()) {
            symTableStringBuilder.append(String.format("%s -> %s\n", key, symTable.lookUp(key).toString()));
        }
        return symTableStringBuilder.toString();
    }
    */

    public String symTablesToString() throws InterpreterException {
        StringBuilder returnString = new StringBuilder();
        if (symTables.isEmpty())
            return returnString.toString() + '\n';

        MyStack<MyIDictionary<String, Value>> stackCopy = new MyStack<>();
        while (!symTables.isEmpty()) {
            if (symTables.peek() instanceof Statement)
                returnString.append((symTables.peek()).toString()).append('\n');
            else
                returnString.append(symTables.peek().toString()).append('\n');
            stackCopy.push(symTables.pop());
        }

        while (!stackCopy.isEmpty()) {
            symTables.push(stackCopy.pop());
        }

        return returnString.toString();
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

    public String procedureTableToString() throws InterpreterException {
        StringBuilder procedureTableStringBuilder = new StringBuilder();
        for (String key: procedureTable.keySet()) {
            procedureTableStringBuilder.append(String.format("%s - %s: %s\n", key, procedureTable.lookUp(key).getKey(), procedureTable.lookUp(key).getValue()));
        }
        procedureTableStringBuilder.append("\n");
        return procedureTableStringBuilder.toString();
    }

    @Override
    public String toString() {
        return "Id: " + id + "\nExecution stack: \n" + exeStack.getReversed() + "\nSymbol tables: \n" + symTables.toString() + "\nOutput list: \n" + out.toString() + "\nFile table:\n" + fileTable.toString() + "\nHeap memory:\n" + heap.toString() + "\nLock Table:\n" + lockTable.toString() + "\nProcedure Table:\n" + procedureTable.toString() + "\n";
    }

    public String programStateToString() throws InterpreterException {
        return "Id: " + id + "\nExecution stack: \n" + exeStackToString() + "Symbol tables: \n" + symTablesToString() + "Output list: \n" + outToString() + "File table:\n" + fileTableToString() + "Heap memory:\n" + heapToString() + "Lock Table:\n" + lockTableToString() + "Procedure Table:\n" + procedureTableToString();
    }
}
