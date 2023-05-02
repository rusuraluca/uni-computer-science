<?php
class DBConnection {
    private string $host = '127.0.0.1';
    private string $database = 'logreportsdb';
    private string $user = 'root';
    private string $password = '';
    private string $charset = 'UTF8';

    # used php data objects (PDO) to connect to database
    private PDO $pdo;
    private string $error;

    public function __construct() {
        $dsn = "mysql:host=$this->host;dbname=$this->database;charset=$this->charset";
        #  array of options that configures the PDO object
        $opt = array(PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, # if a database error occurs, PDO will throw a PDOException instead of just returning false or null
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC, # when you fetch rows from a query result set, PDO will return an associative array where the keys are the column names and the values are the column values
                    PDO::ATTR_EMULATE_PREPARES => false); # emulation is disabled, PDO uses real prepared statements instead (no substituting parameters into the SQL statement.)
        try {
            $this->pdo = new PDO($dsn, $this->user, $this->password, $opt);
        } catch(PDOException $e) {
                $this->error = $e->getMessage();
                echo "Error connecting to database: " . $this->error;
        }
    }

    public function selectAllLogs() {
        // $statement = $this->pdo->query("SELECT * FROM logs");
        $statement = $this->pdo->prepare("SELECT * FROM logs");
        $statement->execute();
        return $statement->fetchAll(PDO::FETCH_ASSOC);
    }

    public function selectLogsBySeverity($severity) {
        // $statement = $this->pdo->query("SELECT * FROM logs L WHERE L.severity = '$severity'");
        if (!empty($severity)) {
            $statement = $this->pdo->prepare("SELECT * FROM logs L WHERE L.severity = ?");
            $statement->execute([$severity]);
            return $statement->fetchAll(PDO::FETCH_ASSOC);
        } else {
            http_response_code(500);
        }
    }

    public function selectLogsByUser($username) {
        // $statement = $this->pdo->query("SELECT * FROM logs L WHERE L.user = '$username'");
        $statement = $this->pdo->prepare("SELECT * FROM logs L WHERE L.user = ?");
        $statement->execute([$username]);
        return $statement->fetchAll(PDO::FETCH_ASSOC);
    }

    public function selectLogsByType($type) {
        // $statement = $this->pdo->query("SELECT * FROM logs L WHERE L.type = '$type'");
        $statement = $this->pdo->prepare("SELECT * FROM logs L WHERE L.type = ?");
        $statement->execute([$type]);
        return $statement->fetchAll(PDO::FETCH_ASSOC);
    }

    public function insertLog($type, $severity, $date, $username, $logtext) {
        $statement = $this->pdo->prepare("INSERT INTO logs(type, severity, date, user, logtext) VALUES (?, ?, ?, ?, ?)");
        return $statement->execute([$type, $severity, $date, $username, $logtext]);
        // return $this->pdo->exec("INSERT INTO logs(type, severity, date, user, logtext) VALUES ('$type', '$severity', '$date', '$username', '$logtext')");
    }

    public function deleteLog($id, $username) {
        $statement = $this->pdo->prepare("DELETE FROM logs WHERE id = ? AND user = ?");
        return $statement->execute([$id, $username]);
        // return $this->pdo->exec("DELETE FROM logs WHERE id = ".$id. " AND user = '$username'");
    }

    public function selectUserByUsername($username) {
        // $statement = $this->pdo->query("SELECT * FROM users U WHERE U.username = '$username'");
        $statement = $this->pdo->prepare("SELECT * FROM users U WHERE U.username = ?");
        $statement->execute([$username]);
        return $statement->fetchAll(PDO::FETCH_ASSOC);
    }

    public function show($value) {
        echo json_encode($value);
    }

    public function run() {
        if (isset($_GET['action']) && !empty($_GET['action'])) {
            switch ($_GET['action']) {
                case 'selectAllLogs':
                    session_start();
                    $result = $this->selectAllLogs();
                    $this->show($result);
                    break;
                case 'selectLogsByUser':
                    session_start();
                    $user = $_SESSION['username'];
                    $result = $this->selectLogsByUser($user);
                    $this->show($result);
                    break;
                case 'selectLogsBySeverity':
                    session_start();
                    $severity = $_GET['severity'];
                    $result = $this->selectLogsBySeverity($severity);
                    $this->show($result);
                    break;
                case 'selectLogsByType':
                    session_start();
                    $type = $_GET['type'];
                    $result = $this->selectLogsByType($type);
                    $this->show($result);
                    break;
                case 'addLog':
                    session_start();
                    $user = $_SESSION['username'];
                    $type = $_GET['logType'];
                    $severity = $_GET['severity'];
                    $date = $_GET['date'];
                    $log = $_GET['log'];
                    $result = $this->insertLog($type, $severity, $date, $user, $log);
                    $this->show($result);
                    break;
                case 'removeLog':
                    session_start();
                    $user = $_SESSION['username'];
                    $id = $_GET['id'];
                    $result = $this->deleteLog($id, $user);
                    $this->show($result);
                    break;
                }
        }
    }
}
$conn = new DBConnection();
$conn->run();
?>
