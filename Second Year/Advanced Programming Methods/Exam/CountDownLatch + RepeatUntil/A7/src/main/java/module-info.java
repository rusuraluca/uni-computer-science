module gui {
    requires javafx.base;
    requires javafx.controls;
    requires javafx.fxml;
    requires javafx.graphics;

    exports View.gui;
    opens View.gui to javafx.fxml;

    exports Controller;
    opens Controller to javafx.fxml;

    exports Exceptions;
    opens Exceptions to javafx.fxml;

    exports  Model.Expressions;
    opens Model.Expressions to javafx.fxml;

    exports Model.ProgramState;
    opens Model.ProgramState to javafx.fxml;

    exports Model.Statements;
    opens Model.Statements to javafx.fxml;

    exports Model.Types;
    opens Model.Types to javafx.fxml;

    exports Model.Collections;
    opens Model.Collections to javafx.fxml;

    exports Model.Value;
    opens Model.Value to javafx.fxml;

    exports Repository;
    opens Repository to javafx.fxml;
}