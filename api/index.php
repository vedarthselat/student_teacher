<?php

function json_response($status, $data)
{
        http_response_code($status);
        $jsonString = json_encode($data);
        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Methods: GET, PUT, POST, DELETE, HEAD, OPTIONS");
        header('Content-Type: application/json');
        header('Content-Length: ' . strlen($jsonString));
        echo $jsonString;
        exit();
}

$uri = $_SERVER['REQUEST_URI'];
$uri = parse_url($_SERVER['REQUEST_URI']);

define('__BASE__', '/~vedarthselat/3430/student_teacher/api/');
$endpoint = str_replace(__BASE__, '', $uri['path']);
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'OPTIONS') {
    if ($method === 'OPTIONS') {
        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Methods: POST, GET, OPTIONS, DELETE, PUT, PATCH");
        header("Access-Control-Allow-Headers: Authorization, Content-Type");
        exit;
    }
    

        exit;
    }

if (explode("/", $endpoint)[0] === "teachers") {
    require_once(__DIR__ . "/routes/teachers_route.php");

        $arr = teachers_func($endpoint, $method);
        json_response($arr[0], $arr[1]);
} else if (explode("/", $endpoint)[0] === "students") {
        require_once __DIR__ . "/routes/students_route.php";
        $arr = students_func($endpoint, $method);
        json_response($arr[0], $arr[1]);
} else if (explode("/", $endpoint)[0] === "appointments") {

        require_once __DIR__ . "/routes/appointments.php";
        $arr = appointments_route($endpoint, $method);
        json_response($arr[0], $arr[1]);
}

else if (explode("/", $endpoint)[0] === "appointmentTeachers") {

    require_once __DIR__ . "/routes/appointmentTeachers.php";
    $arr = appointmentTeachers_route($endpoint, $method);
    json_response($arr[0], $arr[1]);
}

else if (explode("/", $endpoint)[0] === "approved") {

    require_once __DIR__ . "/routes/approved.php";
    $arr = approved_route($endpoint, $method);
    json_response($arr[0], $arr[1]);
}

else if (explode("/", $endpoint)[0] === "approvedTeachers") {

    require_once __DIR__ . "/routes/approvedTeachers.php";
    $arr = approvedTeachers_route($endpoint, $method);
    json_response($arr[0], $arr[1]);
}
else if (explode("/", $endpoint)[0] === "completed") {

    require_once __DIR__ . "/routes/completed.php";
    $arr = completed_route($endpoint, $method);
    json_response($arr[0], $arr[1]);
}

else if(explode("/", $endpoint)[0] === "completedTeachers")
{
    require_once __DIR__."/routes/users.php";
    $arr=users_func($endpoint, $method);
    json_response($arr[0], $arr[1]);
}
else
{
        json_response(400, ["Error"=>"Invalid endpoint!"]);
}
?>


