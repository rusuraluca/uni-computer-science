package View.cli;

import Controller.Controller;
import Model.Enums.Operation;
import Model.Expressions.*;
import Model.ProgramState.ProgramState;
import Model.Statements.*;
import Model.Statements.File.CloseReadFile;
import Model.Statements.File.OpenReadFile;
import Model.Statements.File.ReadFile;
import Model.Types.*;
import Model.Collections.*;
import Model.Values.BoolValue;
import Model.Values.IntValue;
import Model.Values.StringValue;
import Repository.IRepository;
import Repository.Repository;
import View.cli.Menu.ExitCommand;
import View.cli.Menu.RunCommand;
import View.cli.Menu.TextMenu;

/**
 * Class that interprets the program
 */
public class cli {
    public static void main(String[] args) {
        TextMenu menu = new TextMenu();
        menu.addCommand(new ExitCommand("0", "exit"));

        IStatement ex1 = new CompoundStatement(new DeclarationStatement("v", new IntType()),
                new CompoundStatement(new AssignmentStatement("v", new ValueExpression(new IntValue(2))),
                        new PrintStatement(new VariableExpression("v"))));

        try {
            IDictionary<String, IType> typeEnvironment1 = new MyDictionary<>();
            ex1.typecheck(typeEnvironment1);
            ProgramState prg1 = new ProgramState(new MyStack<>(), new MyDictionary<>(), new MyList<>(), new MyDictionary<>(), new MyHeap(), ex1);
            IRepository repo1;
            repo1 = new Repository(prg1, "log1.txt");
            Controller ctrl1 = new Controller(repo1);
            menu.addCommand(new RunCommand("1", ex1.toString(), ctrl1));
        } catch (Exception e) {
            e.printStackTrace();
        }

        IStatement ex2 = new CompoundStatement(new DeclarationStatement("a", new IntType()),
                new CompoundStatement(new DeclarationStatement("b", new IntType()),
                        new CompoundStatement(new AssignmentStatement("a", new ArithmeticExpression(Operation.SUM, new ValueExpression(new IntValue(2)), new
                                ArithmeticExpression(Operation.MULTIPLY, new ValueExpression(new IntValue(3)), new ValueExpression(new IntValue(5))))),
                                new CompoundStatement(new AssignmentStatement("b", new ArithmeticExpression(Operation.SUM, new VariableExpression("a"), new ValueExpression(new
                                        IntValue(1)))), new PrintStatement(new VariableExpression("b"))))));

        try {
            IDictionary<String, IType> typeEnvironment2 = new MyDictionary<>();
            ex2.typecheck(typeEnvironment2);
            ProgramState prg2 = new ProgramState(new MyStack<>(), new MyDictionary<>(), new MyList<>(), new MyDictionary<>(), new MyHeap(), ex2);
            IRepository repo2;
            repo2 = new Repository(prg2, "log2.txt");
            Controller ctrl2 = new Controller(repo2);
            menu.addCommand(new RunCommand("2", ex2.toString(), ctrl2));
        } catch (Exception e) {
            e.printStackTrace();
        }

        IStatement ex3 = new CompoundStatement(new DeclarationStatement("a", new BoolType()),
                new CompoundStatement(new DeclarationStatement("v", new IntType()),
                        new CompoundStatement(new AssignmentStatement("a", new ValueExpression(new BoolValue(true))),
                                new CompoundStatement(new IfStatement(new VariableExpression("a"),
                                        new AssignmentStatement("v", new ValueExpression(new IntValue(2))),
                                        new AssignmentStatement("v", new ValueExpression(new IntValue(3)))),
                                        new PrintStatement(new VariableExpression("v"))))));

        try {
            IDictionary<String, IType> typeEnvironment3 = new MyDictionary<>();
            ex3.typecheck(typeEnvironment3);
            ProgramState prg3 = new ProgramState(new MyStack<>(), new MyDictionary<>(), new MyList<>(), new MyDictionary<>(), new MyHeap(), ex3);
            IRepository repo3;
            repo3 = new Repository(prg3, "log3.txt");
            Controller ctrl3 = new Controller(repo3);
            menu.addCommand(new RunCommand("3", ex3.toString(), ctrl3));
        } catch (Exception e) {
            e.printStackTrace();
        }

        IStatement ex4 = new CompoundStatement(new DeclarationStatement("varf", new StringType()),
                new CompoundStatement(new AssignmentStatement("varf", new ValueExpression(new StringValue("test.in"))),
                        new CompoundStatement(new OpenReadFile(new VariableExpression("varf")),
                                new CompoundStatement(new DeclarationStatement("varc", new IntType()),
                                        new CompoundStatement(new ReadFile(new VariableExpression("varf"), "varc"),
                                                new CompoundStatement(new PrintStatement(new VariableExpression("varc")),
                                                        new CompoundStatement(new ReadFile(new VariableExpression("varf"), "varc"),
                                                                new CompoundStatement(new PrintStatement(new VariableExpression("varc")),
                                                                        new CloseReadFile(new VariableExpression("varf"))))))))));

        try {
            IDictionary<String, IType> typeEnvironment4 = new MyDictionary<>();
            ex4.typecheck(typeEnvironment4);
            ProgramState prg4 = new ProgramState(new MyStack<>(), new MyDictionary<>(), new MyList<>(), new MyDictionary<>(), new MyHeap(), ex4);
            IRepository repo4;
            repo4 = new Repository(prg4, "log4.txt");
            Controller ctrl4 = new Controller(repo4);
            menu.addCommand(new RunCommand("4", ex4.toString(), ctrl4));
        } catch (Exception e) {
            e.printStackTrace();
        }

        IStatement ex5 =
                new CompoundStatement(new DeclarationStatement("a", new IntType()),
                        new CompoundStatement(new AssignmentStatement("a", new ValueExpression(new IntValue(5))),
                                new CompoundStatement(new DeclarationStatement("b", new IntType()),
                                        new CompoundStatement(new AssignmentStatement("b", new ValueExpression(new IntValue(7))),
                                                new IfStatement(
                                                    new RelationalExpression(">", new VariableExpression("a"), new VariableExpression("b")), new PrintStatement(new VariableExpression("a")), new PrintStatement(new VariableExpression("b"))
                                                )
                                        )
                                )
                        )
                );

        try {
            IDictionary<String, IType> typeEnvironment5 = new MyDictionary<>();
            ex5.typecheck(typeEnvironment5);
            ProgramState prg5 = new ProgramState(new MyStack<>(), new MyDictionary<>(), new MyList<>(), new MyDictionary<>(), new MyHeap(), ex5);
            IRepository repo5;
            repo5 = new Repository(prg5, "log5.txt");
            Controller ctrl5 = new Controller(repo5);
            menu.addCommand(new RunCommand("5", ex5.toString(), ctrl5));
        } catch (Exception e) {
            e.printStackTrace();
        }

        IStatement ex6 = new CompoundStatement(new DeclarationStatement("v", new ReferenceType(new IntType())),
                new CompoundStatement(new Model.Statements.NewStatement("v", new ValueExpression(new IntValue(20))),
                        new CompoundStatement(new DeclarationStatement("a", new ReferenceType(new ReferenceType(new IntType()))),
                                new CompoundStatement(new Model.Statements.NewStatement("a", new VariableExpression("v")),
                                        new CompoundStatement(new PrintStatement(new VariableExpression("v")), new PrintStatement(new VariableExpression("a")))))));

        try {
            IDictionary<String, IType> typeEnvironment6 = new MyDictionary<>();
            ex6.typecheck(typeEnvironment6);
            ProgramState prg6 = new ProgramState(new MyStack<>(), new MyDictionary<>(), new MyList<>(), new MyDictionary<>(), new MyHeap(), ex6);
            IRepository repo6;
            repo6 = new Repository(prg6, "log6.txt");
            Controller controller6 = new Controller(repo6);
            menu.addCommand(new RunCommand("6", ex6.toString(), controller6));
        } catch (Exception e) {
            e.printStackTrace();
        }

        IStatement ex7 = new CompoundStatement(new DeclarationStatement("v", new ReferenceType(new IntType())),
                new CompoundStatement(new Model.Statements.NewStatement("v", new ValueExpression(new IntValue(20))),
                        new CompoundStatement(new DeclarationStatement("a", new ReferenceType(new ReferenceType(new IntType()))),
                                new CompoundStatement(new Model.Statements.NewStatement("a", new VariableExpression("v")),
                                        new CompoundStatement(new PrintStatement(new ReadHeapExpression(new VariableExpression("v"))),
                                                new PrintStatement(new ArithmeticExpression(Operation.SUM,new ReadHeapExpression(new ReadHeapExpression(new VariableExpression("a"))), new ValueExpression(new IntValue(5)))))))));

        try {
            IDictionary<String, IType> typeEnvironment7 = new MyDictionary<>();
            ex7.typecheck(typeEnvironment7);
            ProgramState prg7 = new ProgramState(new MyStack<>(), new MyDictionary<>(), new MyList<>(), new MyDictionary<>(), new MyHeap(), ex7);
            IRepository repo7;
            repo7 = new Repository(prg7, "log7.txt");
            Controller controller7 = new Controller(repo7);
            menu.addCommand(new RunCommand("7", ex7.toString(), controller7));
        } catch (Exception e) {
            e.printStackTrace();
        }

        IStatement ex8 = new CompoundStatement(new DeclarationStatement("v", new ReferenceType(new IntType())),
                new CompoundStatement(new Model.Statements.NewStatement("v", new ValueExpression(new IntValue(20))),
                        new CompoundStatement( new PrintStatement(new ReadHeapExpression(new VariableExpression("v"))),
                                new CompoundStatement(new Model.Statements.WriteHeapStatement("v", new ValueExpression(new IntValue(30))),
                                        new PrintStatement(new ArithmeticExpression(Operation.SUM, new ReadHeapExpression(new VariableExpression("v")), new ValueExpression(new IntValue(5))))))));

        try {
            IDictionary<String, IType> typeEnvironment8 = new MyDictionary<>();
            ex8.typecheck(typeEnvironment8);
            ProgramState prg8 = new ProgramState(new MyStack<>(), new MyDictionary<>(), new MyList<>(), new MyDictionary<>(), new MyHeap(), ex8);
            IRepository repo8;
            repo8 = new Repository(prg8, "log8.txt");
            Controller controller8 = new Controller(repo8);
            menu.addCommand(new RunCommand("8", ex8.toString(), controller8));
        } catch (Exception e) {
            e.printStackTrace();
        }

        IStatement ex9 = new CompoundStatement(new DeclarationStatement("v", new ReferenceType(new IntType())),
                new CompoundStatement(new Model.Statements.NewStatement("v", new ValueExpression(new IntValue(20))),
                        new CompoundStatement(new DeclarationStatement("a", new ReferenceType(new ReferenceType(new IntType()))),
                                new CompoundStatement(new Model.Statements.NewStatement("a", new VariableExpression("v")),
                                        new CompoundStatement(new Model.Statements.NewStatement("v", new ValueExpression(new IntValue(30))),
                                                new PrintStatement(new ReadHeapExpression(new ReadHeapExpression(new VariableExpression("a")))))))));

        try {
            IDictionary<String, IType> typeEnvironment9 = new MyDictionary<>();
            ex9.typecheck(typeEnvironment9);
            ProgramState prg9 = new ProgramState(new MyStack<>(), new MyDictionary<>(), new MyList<>(), new MyDictionary<>(), new MyHeap(), ex9);
            IRepository repo9;
            repo9 = new Repository(prg9, "log9.txt");
            Controller controller9 = new Controller(repo9);
            menu.addCommand(new RunCommand("9", ex9.toString(), controller9));
        } catch (Exception e) {
            e.printStackTrace();
        }

        IStatement ex10 = new CompoundStatement(new DeclarationStatement("v", new IntType()),
                new CompoundStatement(new AssignmentStatement("v", new ValueExpression(new IntValue(4))),
                        new CompoundStatement(new Model.Statements.WhileStatement(new RelationalExpression(">", new VariableExpression("v"), new ValueExpression(new IntValue(0))),
                                new CompoundStatement(new PrintStatement(new VariableExpression("v")), new AssignmentStatement("v",new ArithmeticExpression(Operation.SUBTRACT, new VariableExpression("v"), new ValueExpression(new IntValue(1)))))),
                                new PrintStatement(new VariableExpression("v")))));

        try {
            IDictionary<String, IType> typeEnvironment10 = new MyDictionary<>();
            ex10.typecheck(typeEnvironment10);
            ProgramState prg10 = new ProgramState(new MyStack<>(), new MyDictionary<>(), new MyList<>(), new MyDictionary<>(), new MyHeap(), ex10);
            IRepository repo10;
            repo10 = new Repository(prg10, "log10.txt");
            Controller controller10 = new Controller(repo10);
            menu.addCommand(new RunCommand("10", ex10.toString(), controller10));
        } catch (Exception e) {
            e.printStackTrace();
        }

        IStatement ex11 = new CompoundStatement(new DeclarationStatement("v", new IntType()),
                new CompoundStatement(new DeclarationStatement("a", new ReferenceType(new IntType())),
                        new CompoundStatement(new AssignmentStatement("v", new ValueExpression(new IntValue(10))),
                                new CompoundStatement(new NewStatement("a", new ValueExpression(new IntValue(22))),
                                        new CompoundStatement(new ForkStatement(new CompoundStatement(new WriteHeapStatement("a", new ValueExpression(new IntValue(30))),
                                                new CompoundStatement(new AssignmentStatement("v", new ValueExpression(new IntValue(32))),
                                                        new CompoundStatement(new PrintStatement(new VariableExpression("v")), new PrintStatement(new ReadHeapExpression(new VariableExpression("a"))))))),
                                                new CompoundStatement(new PrintStatement(new VariableExpression("v")), new PrintStatement(new ReadHeapExpression(new VariableExpression("a")))))))));
        try {
            IDictionary<String, IType> typeEnvironment11 = new MyDictionary<>();
            ex11.typecheck(typeEnvironment11);
            ProgramState prg11 = new ProgramState(new MyStack<>(), new MyDictionary<>(), new MyList<>(), new MyDictionary<>(), new MyHeap(), ex11);
            IRepository repo11;
            repo11 = new Repository(prg11, "log11.txt");
            Controller controller11 = new Controller(repo11);
            menu.addCommand(new RunCommand("11", ex11.toString(), controller11));
        } catch (Exception e) {
            e.printStackTrace();
        }

        menu.show();
    }
}