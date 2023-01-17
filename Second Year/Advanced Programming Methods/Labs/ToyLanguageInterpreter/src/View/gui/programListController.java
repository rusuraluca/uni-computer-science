package View.GUI;

import java.io.BufferedReader;
import java.io.IOException;
import java.net.URL;
import java.util.ArrayList;
import java.util.ResourceBundle;

import Controller.LanguageController;
import Exceptions.TypeCheckerException;
import Model.ProgramState.ExeStack.ExeStack;
import Model.ProgramState.ExeStack.MyIStack;
import Model.ProgramState.SymTable.MyIDict;
import Model.ProgramState.Heap.*;
import Model.ProgramState.FileTable.*;
import Model.ProgramState.OutList.*;
import Model.Expression.*;
import Model.ProgramState.SymTable.SymTable;
import Model.Statement.*;
import Model.Statement.FileStatements.CloseRFile;
import Model.Statement.Concurrency.ForkStmt;
import Model.Statement.HeapStatements.WriteHeapStmt;
import Model.Statement.HeapStatements.NewStmt;
import Model.Statement.FileStatements.OpenRFileStmt;
import Model.Statement.FileStatements.ReadFileStmt;
import Model.Type.*;
import Model.Value.BoolValue;
import Model.Value.IntValue;
import Model.Value.StringValue;
import Repository.IRepository;
import Repository.StateRepository;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.event.ActionEvent;
import javafx.event.EventHandler;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.fxml.Initializable;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.control.Alert;
import javafx.scene.control.Button;
import javafx.scene.control.ListView;
import javafx.stage.Stage;
import javafx.util.Callback;

public class PrgListController implements Initializable {

    static ArrayList<IRepository> repositories;
    static ArrayList<LanguageController> controllers;
    static ArrayList<IStmt> programs;
    @FXML
    ListView<LanguageController> myPrgList;
    @FXML
    Button runButton;

    public void setUp() {
        repositories = new ArrayList<>();
        controllers = new ArrayList<>();
        programs = new ArrayList<>();

        programs.add(new CompStmt(new VarDecl("v",new IntType()),
                new CompStmt(new AssignStmt("v",new ValueExp(new IntValue(2))),
                        new PrintStmt(new VariableExp("v")))));
        programs.add(new CompStmt( new VarDecl("a",new IntType()),
                new CompStmt(new VarDecl("b",new IntType()),
                        new CompStmt(new AssignStmt("a", new ArithExp('+',
                                new ValueExp(new IntValue(2)),new ArithExp('*',
                                new VariableExp("a"), new ValueExp(new IntValue(5))))),
                                new CompStmt(new AssignStmt("b",new ArithExp('+',
                                        new VariableExp("a"), new ValueExp(new IntValue(1)))),
                                        new PrintStmt(new VariableExp("b")))))));
        programs.add(new CompStmt(new VarDecl("a",new BoolType()),
                new CompStmt(new VarDecl("v", new IntType()),
                        new CompStmt(new AssignStmt("a", new ValueExp(new BoolValue(true))),
                                new CompStmt(new IfStmt(new VariableExp("a"),
                                        new AssignStmt("v",new ValueExp(new IntValue(2))),
                                        new AssignStmt("v", new ValueExp(new IntValue(3)))),
                                        new PrintStmt(new VariableExp("v")))))));
        programs.add(new CompStmt(new VarDecl("varf",new StringType()),
                new CompStmt(new AssignStmt("varf", new ValueExp(new StringValue("test.in"))),
                        new CompStmt(new OpenRFileStmt(new VariableExp("varf")),
                                new CompStmt(new VarDecl("varc", new IntType()),
                                        new CompStmt(new ReadFileStmt(new VariableExp("varf"), "varc"),
                                                new CompStmt(new PrintStmt(new VariableExp("varc")),
                                                        new CompStmt(new ReadFileStmt(new VariableExp("varf"), "varc"),
                                                                new CompStmt(new PrintStmt(new VariableExp("varc")), new CloseRFile(new VariableExp("varf")))))))))));
        programs.add(new CompStmt(new VarDecl("v", new RefType(new IntType())),
                new CompStmt(new NewStmt("v", new ValueExp(new IntValue(20))),
                        new CompStmt(new VarDecl("a", new RefType(new RefType(new IntType()))),
                                new CompStmt(new NewStmt("a", new VariableExp("v")),
                                        new CompStmt(new PrintStmt(new VariableExp("v")), new PrintStmt(new VariableExp("a"))))))));
        programs.add(new CompStmt(new VarDecl("v", new RefType(new IntType())),
                new CompStmt(new NewStmt("v", new ValueExp(new IntValue(20))),
                        new CompStmt(new VarDecl("a", new RefType(new RefType(new IntType()))),
                                new CompStmt(new NewStmt("a", new VariableExp("v")),
                                        new CompStmt(new PrintStmt(new ReadHeapExp(new VariableExp("v"))), new PrintStmt(new ArithExp('+', new ReadHeapExp(new ReadHeapExp(new VariableExp("a"))), new ValueExp(new IntValue(5))))))))));
        programs.add(new CompStmt(new VarDecl("v", new RefType(new IntType())),
                new CompStmt(new NewStmt("v", new ValueExp(new IntValue(20))),
                        new CompStmt(new PrintStmt(new ReadHeapExp(new VariableExp("v"))),
                                new CompStmt(new WriteHeapStmt("v", new ValueExp(new IntValue(30))),
                                        new PrintStmt(new ArithExp('+', new ReadHeapExp(new VariableExp("v")), new ValueExp(new IntValue(5)))))))));

        programs.add(new CompStmt(new VarDecl("v", new RefType(new IntType())),
                new CompStmt(new NewStmt("v", new ValueExp(new IntValue(20))),
                        new CompStmt(new VarDecl("a", new RefType(new RefType(new IntType()))),
                                new CompStmt(new NewStmt("a", new VariableExp("v")),
                                        new CompStmt(new NewStmt("v", new ValueExp(new IntValue(30))),
                                                new PrintStmt(new ReadHeapExp(new ReadHeapExp(new VariableExp("a"))))))))));

        programs.add(new CompStmt(new VarDecl("v", new IntType()),
                new CompStmt(new AssignStmt("v", new ValueExp(new IntValue(4))),
                        new CompStmt(new WhileStatement(new RelationalExp(new VariableExp("v"), new ValueExp(new IntValue(0)), ">"),
                                new CompStmt(new PrintStmt(new VariableExp("v")), new AssignStmt("v", new ArithExp('-', new VariableExp("v"), new ValueExp(new IntValue(1)))))),
                                new PrintStmt(new VariableExp("v"))))));

        programs.add(new CompStmt(new VarDecl("v", new IntType()),
                new CompStmt(new VarDecl("a", new RefType(new IntType())),
                        new CompStmt(new AssignStmt("v", new ValueExp(new IntValue(10))),
                                new CompStmt(new NewStmt("a", new ValueExp(new IntValue(22))),
                                        new CompStmt(new ForkStmt(new CompStmt(new WriteHeapStmt("a", new ValueExp(new IntValue(30))),
                                                new CompStmt(new AssignStmt("v", new ValueExp(new IntValue(32))),
                                                        new CompStmt(new PrintStmt(new VariableExp("v")), new PrintStmt(new ReadHeapExp(new VariableExp("a"))))))
                                        ),
                                                new CompStmt(new PrintStmt(new VariableExp("v")),
                                                        new PrintStmt(new ReadHeapExp(new VariableExp("a"))))
                                        ))))));

        programs.add(new CompStmt(new VarDecl("a", new IntType()),
                new CompStmt(new VarDecl("b", new IntType()),
                        new CompStmt(new VarDecl("c", new IntType()),
                                new CompStmt(new AssignStmt("a", new ValueExp(new IntValue(1))),
                                        new CompStmt(new AssignStmt("b", new ValueExp(new IntValue(2))),
                                                new CompStmt(new AssignStmt("c", new ValueExp(new IntValue(5))),
                                                        new CompStmt(new SwitchStmt(new ArithExp('*', new VariableExp("a"), new ValueExp(new IntValue(10))),
                                                                new ArithExp('*', new VariableExp("b"), new VariableExp("c")),
                                                                new ValueExp(new IntValue(10)),
                                                                new CompStmt(new PrintStmt(new VariableExp("a")), new PrintStmt(new VariableExp("b"))),
                                                                new CompStmt(new PrintStmt(new ValueExp(new IntValue(100))), new PrintStmt(new ValueExp(new IntValue(200)))),
                                                                new PrintStmt(new ValueExp(new IntValue(300)))),
                                                                new PrintStmt(new ValueExp(new IntValue(300)))))))))));

        int counter = 0;
        for (IStmt stmt : programs) {
            try {
                ++counter;
                stmt.typecheck(new SymTable<String, IType>());
            }
            catch (TypeCheckerException tce) {
                Alert alert = new Alert(Alert.AlertType.INFORMATION);
                alert.setTitle("Typechecker found an error for program " + counter +  " !");
                alert.setHeaderText(null);
                alert.setContentText(tce.getMessage());
                alert.showAndWait();
            }
        }

        repositories.add(new StateRepository("log1.txt"));
        repositories.add(new StateRepository("log2.txt"));
        repositories.add(new StateRepository("log3.txt"));
        repositories.add(new StateRepository("log4.txt"));
        repositories.add(new StateRepository("log5.txt"));
        repositories.add(new StateRepository("log6.txt"));
        repositories.add(new StateRepository("log7.txt"));
        repositories.add(new StateRepository("log8.txt"));
        repositories.add(new StateRepository("log9.txt"));
        repositories.add(new StateRepository("log10.txt"));
        repositories.add(new StateRepository("log11.txt"));

        repositories.get(0).addProgramState(programs.get(0));
        repositories.get(1).addProgramState(programs.get(1));
        repositories.get(2).addProgramState(programs.get(2));
        repositories.get(3).addProgramState(programs.get(3));
        repositories.get(4).addProgramState(programs.get(4));
        repositories.get(5).addProgramState(programs.get(5));
        repositories.get(6).addProgramState(programs.get(6));
        repositories.get(7).addProgramState(programs.get(7));
        repositories.get(8).addProgramState(programs.get(8));
        repositories.get(9).addProgramState(programs.get(9));
        repositories.get(10).addProgramState(programs.get(10));


        controllers.add(new LanguageController(repositories.get(0)));
        controllers.add(new LanguageController(repositories.get(1)));
        controllers.add(new LanguageController(repositories.get(2)));
        controllers.add(new LanguageController(repositories.get(3)));
        controllers.add(new LanguageController(repositories.get(4)));
        controllers.add(new LanguageController(repositories.get(5)));
        controllers.add(new LanguageController(repositories.get(6)));
        controllers.add(new LanguageController(repositories.get(7)));
        controllers.add(new LanguageController(repositories.get(8)));
        controllers.add(new LanguageController(repositories.get(9)));
        controllers.add(new LanguageController(repositories.get(10)));



    }

    @Override
    public void initialize(URL location, ResourceBundle resources) {
        setUp();
        ObservableList<LanguageController> myData = FXCollections.observableArrayList();
        myData.add(controllers.get(0));
        myData.add(controllers.get(1));
        myData.add(controllers.get(2));
        myData.add(controllers.get(3));
        myData.add(controllers.get(4));
        myData.add(controllers.get(5));
        myData.add(controllers.get(6));
        myData.add(controllers.get(7));
        myData.add(controllers.get(8));
        myData.add(controllers.get(9));
        myData.add(controllers.get(10));
        myPrgList.setItems(myData);
        myPrgList.getSelectionModel().selectFirst();
        runButton.setOnAction(new EventHandler<ActionEvent>() {
            @Override
            public void handle (ActionEvent e) {
                Stage programStage = new Stage();
                Parent programRoot;
                Callback<Class<?>, Object> controllerFactory = type -> {
                    if (type == PrgRunController.class) {
                        return new PrgRunController(myPrgList.getSelectionModel().getSelectedItem());
                    } else {
                        try {
                            return type.getDeclaredConstructor().newInstance();
                        } catch (Exception exc) {
                            System.err.println("Could not create controller for "+type.getName());
                            throw new RuntimeException(exc);
                        }
                    }
                };
                try {
                    FXMLLoader fxmlLoader = new FXMLLoader(getClass().getResource("/ProgramLayout.fxml"));
                    fxmlLoader.setControllerFactory(controllerFactory);
                    programRoot = fxmlLoader.load();
                    Scene programScene = new Scene(programRoot);
                    programStage.setTitle("Toy Language - Program running");
                    programStage.setScene(programScene);
                    programStage.show();
                } catch (IOException e1) {
                    e1.printStackTrace();
                }
            }
        });
    }

}
