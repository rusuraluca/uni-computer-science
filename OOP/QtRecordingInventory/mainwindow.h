#ifndef MAINWINDOW_H
#define MAINWINDOW_H

#include <QMainWindow>
#include <QFormLayout>
#include <QVBoxLayout>
#include <QLabel>
#include <QLineEdit>
#include <QPushButton>
#include <QTableWidget>
#include <QTableWidgetItem>
#include <QMessageBox>
#include <QKeyEvent>
#include <QKeySequence>
#include "Controller/Controller.h"

QT_BEGIN_NAMESPACE
namespace Ui { class MainWindow; }
QT_END_NAMESPACE

class MainWindow : public QMainWindow {
    Q_OBJECT

public:
    MainWindow(Controller<Recording> *ctrl, QWidget *parent = nullptr);
    ~MainWindow();

private slots:
    void handleTabel();
    void handleInsert();
    void handleDelete(Recording);
    void handleUpdate();

protected:
    void keyPressEvent(QKeyEvent *event) override;

private:
    Ui::MainWindow *ui;
    Controller<Recording> *ctrl;

    QWidget* centralWidget;
    QFormLayout *formLayout;
    QVBoxLayout *vboxLayout;
    QLabel *indexLabel;
    QLineEdit *indexInput;
    QLabel *titleLabel;
    QLineEdit *titleInput;
    QLabel *authorLabel;
    QLineEdit *authorInput;
    QLabel *durationLabel;
    QLineEdit *durationInput;
    QLabel *typeLabel;
    QLineEdit *typeInput;
    QPushButton *insertBtn;
    QTableWidget *tableWgt;
    QFormLayout *formLayout2;
    QHBoxLayout *hboxLayout;
    QLabel *indexLabel2;
    QLineEdit *indexInput2;
    QLabel *titleLabel2;
    QLineEdit *titleInput2;
    QLabel *authorLabel2;
    QLineEdit *authorInput2;
    QLabel *durationLabel2;
    QLineEdit *durationInput2;
    QLabel *typeLabel2;
    QLineEdit *typeInput2;
    QPushButton *updateBtn;

};
#endif // MAINWINDOW_H
