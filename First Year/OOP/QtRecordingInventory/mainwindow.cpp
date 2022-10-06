#include "mainwindow.h"
#include "ui_mainwindow.h"

void MainWindow::handleTabel(){
    std::vector<Recording> all = ctrl->getAll();

    this->tableWgt->setRowCount(all.size());

    for(unsigned long i = 0; i < all.size(); ++i){
       this->tableWgt->setItem(i, 0, new QTableWidgetItem(QString::number(all.at(i).getId())));
       this->tableWgt->setItem(i, 1, new QTableWidgetItem(QString::fromStdString(all.at(i).getTitle())));
       this->tableWgt->setItem(i, 2, new QTableWidgetItem(QString::fromStdString(all.at(i).getAuthor())));
       this->tableWgt->setItem(i, 3, new QTableWidgetItem(QString::number(all.at(i).getLength())));
       this->tableWgt->setItem(i, 4, new QTableWidgetItem(QString::fromStdString(all.at(i).getType())));

       QPushButton *deleteBtn = new QPushButton("Delete");
       tableWgt->setCellWidget(i, 5, deleteBtn);
       connect(deleteBtn, &QPushButton::released, this, std::bind(&MainWindow::handleDelete, this, Recording(all.at(i).getId(), all.at(i).getTitle(), all.at(i).getAuthor(), all.at(i).getLength(), all.at(i).getType())));
    }

    this->vboxLayout->addWidget(this->tableWgt);
}

void MainWindow::keyPressEvent(QKeyEvent* event){
    QWidget::keyPressEvent(event);
    int k = event->key();
    QMessageBox msgBox;
    switch (k){
        case Qt::Key_Z:
                this->ctrl->undo();
                MainWindow::handleTabel();
                break;
        case Qt::Key_Y:
                this->ctrl->redo();
                MainWindow::handleTabel();
                break;
    }
}
    /*
    QMainWindow::keyPressEvent(event);

    QKeyEvent *ke= static_cast<QKeyEvent *>(event);

    if(ke->key() == QKeySequence::Undo){
        try{
            QMessageBox msgBox;
            msgBox.setText("bro what undo");
            //this->ctrl->undo();
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

    if(ke->key() == QKeySequence::Redo){
        try{
            //this->ctrl->redo();
            QMessageBox msgBox;
            msgBox.setText("bro what redo");
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
    */

void MainWindow::handleDelete(Recording rec){
    try{
        this->ctrl->remove(rec);
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

void MainWindow::handleUpdate(){
    QString indexQ = indexInput2->text();
    int indexSTD = indexQ.toInt();
    QString titleQ = titleInput2->text();
    std::string titleSTD = titleQ.toStdString();
    QString authorQ = authorInput2->text();
    std::string authorSTD = authorQ.toStdString();
    QString durationQ = durationInput2->text();
    double durationSTD = durationQ.toDouble();
    QString typeQ = typeInput2->text();
    std::string typeSTD = typeQ.toStdString();

    try{
        this->ctrl->update(Recording(indexSTD, titleSTD, authorSTD, durationSTD, typeSTD));
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

void MainWindow::handleInsert(){
    QString indexQ = indexInput->text();
    int indexSTD = indexQ.toInt();
    QString titleQ = titleInput->text();
    std::string titleSTD = titleQ.toStdString();
    QString authorQ = authorInput->text();
    std::string authorSTD = authorQ.toStdString();
    QString durationQ = durationInput->text();
    double durationSTD = durationQ.toDouble();
    QString typeQ = typeInput->text();
    std::string typeSTD = typeQ.toStdString();

    std::vector<Recording> all = ctrl->getAll();

    try{
        this->ctrl->add(Recording(indexSTD, titleSTD, authorSTD, durationSTD, typeSTD));
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

MainWindow::MainWindow(Controller<Recording> *ctrl, QWidget *parent)
    : QMainWindow(parent)
    , ui(new Ui::MainWindow)
{
    ui->setupUi(this);

    this->ctrl = ctrl;

    centralWidget = new QWidget();
    vboxLayout = new QVBoxLayout();
    hboxLayout = new QHBoxLayout();

    formLayout = new QFormLayout();

    indexLabel = new QLabel("Index: ");
    indexInput = new QLineEdit();
    titleLabel = new QLabel("Title: ");
    titleInput = new QLineEdit();
    authorLabel = new QLabel("Author: ");
    authorInput = new QLineEdit();
    durationLabel = new QLabel("Duration: ");
    durationInput = new QLineEdit();
    typeLabel = new QLabel("Type: ");
    typeInput = new QLineEdit();
    insertBtn = new QPushButton("Add");
    connect(insertBtn, &QPushButton::released, this, &MainWindow::handleInsert);

    formLayout->addRow(indexLabel, indexInput);
    formLayout->addRow(titleLabel, titleInput);
    formLayout->addRow(authorLabel, authorInput);
    formLayout->addRow(durationLabel, durationInput);
    formLayout->addRow(typeLabel, typeInput);
    formLayout->addWidget(insertBtn);

    hboxLayout->addLayout(formLayout);

    formLayout2 = new QFormLayout();

    indexLabel2 = new QLabel("Index to update: ");
    indexInput2 = new QLineEdit();
    titleLabel2 = new QLabel("New Title: ");
    titleInput2 = new QLineEdit();
    authorLabel2 = new QLabel("New Author: ");
    authorInput2 = new QLineEdit();
    durationLabel2 = new QLabel("New Duration: ");
    durationInput2 = new QLineEdit();
    typeLabel2 = new QLabel("New Type: ");
    typeInput2 = new QLineEdit();
    updateBtn = new QPushButton("Update");
    connect(updateBtn, &QPushButton::released, this, &MainWindow::handleUpdate);

    formLayout2->addRow(indexLabel2, indexInput2);
    formLayout2->addRow(titleLabel2, titleInput2);
    formLayout2->addRow(authorLabel2, authorInput2);
    formLayout2->addRow(durationLabel2, durationInput2);
    formLayout2->addRow(typeLabel2, typeInput2);
    formLayout2->addWidget(updateBtn);

    hboxLayout->addLayout(formLayout2);

    vboxLayout->addLayout(hboxLayout);

    tableWgt = new QTableWidget();
    this->tableWgt->setColumnCount(6);
    QStringList columns {"Id:", "Title:", "Author:", "Duration:", "Type:", "Action:"};
    tableWgt->setHorizontalHeaderLabels(columns);
    MainWindow::handleTabel();

    centralWidget->setLayout(vboxLayout);
    this->setCentralWidget(centralWidget);
}

MainWindow::~MainWindow()
{
    delete ui;
    delete centralWidget;
    delete formLayout;
    delete vboxLayout;
    delete indexLabel;
    delete indexInput;
    delete titleLabel;
    delete titleInput;
    delete authorLabel;
    delete authorInput;
    delete durationLabel;
    delete durationInput;
    delete typeLabel;
    delete typeInput;
    delete insertBtn;
    delete tableWgt;
    delete formLayout2;
    delete hboxLayout;
    delete indexLabel2;
    delete indexInput2;
    delete titleLabel2;
    delete titleInput2;
    delete authorLabel2;
    delete authorInput2;
    delete durationLabel2;
    delete durationInput2;
    delete typeLabel2;
    delete typeInput2;
    delete updateBtn;
}

