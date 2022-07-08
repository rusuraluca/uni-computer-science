#include "keypress.h"

void KeyPress::keyReleaseEvent(QKeyEvent *event) {
    if (e->key() == Qt::Key_Undo)
            try{
                this->ctrl->undo();
                MainWindow::handleTabel();
            } catch (RepoException& e) {
                QMessageBox msgBox;
                msgBox.setText(e.getMsg().c_str());
                msgBox.exec();
            } catch (ValidationException& e) {
                QMessageBox msgBox;
                msgBox.setText(e.getMsg().c_str());
                msgBox.exec();
            }
   if (e->key() == Qt::Key_Redo)
            try{
                this->ctrl->redo();
                MainWindow::handleTabel();
            } catch (RepoException& e) {
                QMessageBox msgBox;
                msgBox.setText(e.getMsg().c_str());
                msgBox.exec();
            } catch (ValidationException& e) {
                QMessageBox msgBox;
                msgBox.setText(e.getMsg().c_str());
                msgBox.exec();
            }
}
