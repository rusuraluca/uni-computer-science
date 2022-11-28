
import Model.Collections.List.MyList;
import Controller.Controller;
import Model.Statements.ReadFile;
import Model.Statements.OpenReadFile;
import Model.Statements.CloseReadFile;
import Model.Expressions.ArithmeticExpression;
import Model.Expressions.Enums.Operation;
import Model.Expressions.ValueExpression;
import Model.Expressions.VariableExpression;
import Model.ProgramState;
import Model.Statements.*;
import Model.Types.BoolType;
import Model.Types.IntType;
import Model.Types.StringType;
import Model.Values.BoolValue;
import Model.Values.IntValue;
import Model.Values.StringValue;
import Repository.IRepository;
import Repository.Repository;
import View.TextMenu;
import View.Commands.ExitCommand;
import View.Commands.RunCommand;


public class Main {
    public static void main(String[] args) {


        // int v; v=2; print(v)
        IStmt ex1 = new CompoundStmt(
                        new VariableDeclarationStmt("v", new IntType()),
                        new CompoundStmt(
                                new AssignmentStmt("v", new ValueExpression(new IntValue(2))),
                                new PrintStmt(new VariableExpression("v"))));

        MyList<ProgramState> prg1 = new MyList<>();
        prg1.add(new ProgramState(ex1));
        IRepository repo1 = new Repository(prg1, new StringValue("log1.txt"));
        Controller ctrl1 = new Controller(repo1);

        // int a; int b; a=2+3*5; b=a+1; print(b)
        IStmt ex2 = new CompoundStmt(
                        new VariableDeclarationStmt("a", new IntType()),
                        new CompoundStmt(
                                new VariableDeclarationStmt("b", new IntType()),
                                new CompoundStmt(
                                        new AssignmentStmt("a", new ArithmeticExpression(Operation.SUM, new ValueExpression(new IntValue(2)), new ArithmeticExpression(Operation.MULTIPLY, new ValueExpression(new IntValue(3)), new ValueExpression(new IntValue(5))))),
                                        new CompoundStmt(new AssignmentStmt("b", new ArithmeticExpression(Operation.SUM, new VariableExpression("a"), new ValueExpression( new IntValue(1)))), new PrintStmt(new VariableExpression("b")))
                                )
                        )
        );

        MyList<ProgramState> prg2 = new MyList<>();
        prg2.add(new ProgramState(ex2));
        IRepository repo2 = new Repository(prg2, new StringValue("log2.txt"));
        Controller ctrl2 = new Controller(repo2);


        // bool a; int v; a = true; (if a then v=2 else v=3); print(v)
        IStmt ex3 = new CompoundStmt(
                        new VariableDeclarationStmt("a", new BoolType()),
                        new CompoundStmt(
                                new VariableDeclarationStmt("v", new IntType()),
                                new CompoundStmt(
                                        new AssignmentStmt("a", new ValueExpression(new BoolValue(true))),
                                        new CompoundStmt(
                                                new IfStmt(new VariableExpression("a"), new AssignmentStmt("v", new ValueExpression(new IntValue(2))), new AssignmentStmt("v", new ValueExpression(new IntValue(3)))),
                                                new PrintStmt(new VariableExpression("v"))
                                                )
                                        )
                                )
        );

        MyList<ProgramState> prg3 = new MyList<>();
        prg3.add(new ProgramState(ex3));
        IRepository repo3 = new Repository(prg3, new StringValue("log3.txt"));
        Controller ctrl3 = new Controller(repo3);


        IStmt ex4 = new CompoundStmt(new CompoundStmt(new CompoundStmt(new CompoundStmt(new CompoundStmt(new CompoundStmt(new CompoundStmt( new CompoundStmt( new VariableDeclarationStmt("file", new StringType()), new AssignmentStmt("file", new ValueExpression(new StringValue("test.in")))),
        new OpenReadFile( new VariableExpression("file"))), new VariableDeclarationStmt("x", new IntType())),
                   new ReadFile(new VariableExpression("file"), "x")),
                new PrintStmt(new VariableExpression("x"))),

                new ReadFile(new VariableExpression("file"), "x")),
                new PrintStmt(new VariableExpression("x"))),
                new CloseReadFile(new VariableExpression("file")));

        MyList<ProgramState> prg4 = new MyList<>();
        prg4.add(new ProgramState(ex4));
        IRepository repo4 = new Repository(prg4, new StringValue("log4.txt"));
        Controller ctrl4 = new Controller(repo4);

        TextMenu menu = new TextMenu();
        menu.addCommand(new ExitCommand("0", "Exit"));
        menu.addCommand(new RunCommand("1", ex1.toString(), ctrl1));
        menu.addCommand(new RunCommand("2", ex2.toString(), ctrl2));
        menu.addCommand(new RunCommand("3", ex3.toString(), ctrl3));
        menu.addCommand(new RunCommand("4", ex4.toString(), ctrl4));
        menu.show();
    }
}