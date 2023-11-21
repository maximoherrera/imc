
function validateForm() {
    var apellido = document.getElementById("apellido").value;
    var legajo = document.getElementById("legajo").value;
    var sexo = document.getElementById("sexo").value;
    var peso = document.getElementById("peso").value;
    var altura = document.getElementById("altura").value;

    if (apellido.length < 3) {
        alert("Apellido debe tener al menos 3 caracteres");
        return false;
    }

    // Condición: El peso, el legajo y la altura deben ser valores numéricos mayores a 0.
    if (!isNumeric(peso) || peso <= 0) {
        alert("Peso debe ser un valor numérico mayor a 0");
        return false;
    }

    if (!isNumeric(legajo) || legajo <= 0) {
        alert("Legajo debe ser un valor numérico mayor a 0");
        return false;
    }

    if (!isNumeric(altura) || altura <= 0) {
        alert("Altura debe ser un valor numérico mayor a 0");
        return false;
    }

    // Condición: El legajo será único para cada alumno.
    var peopleList;
    if (localStorage.getItem("peopleList") == null) {
        peopleList = [];
    } else {
        peopleList = JSON.parse(localStorage.getItem("peopleList"));
    }

    for (var i = 0; i < peopleList.length; i++) {
        if (peopleList[i].legajo === legajo) {
            alert("El legajo ingresado ya existe. Debe ser único.");
            return false;
        }
    }

    // Condición: El sexo debe ser "masculino", "femenino" u "otro".
    if (!(sexo.toLowerCase() === "masculino" || sexo.toLowerCase() === "femenino" || sexo.toLowerCase() === "otro")) {
        alert("Sexo debe ser 'masculino', 'femenino' u 'otro'");
        return false;
    }

    return true;
}

function isNumeric(value) {
    // Función auxiliar para verificar si un valor es numérico.
    return !isNaN(parseFloat(value)) && isFinite(value);
}

var editingExistingStudent = false;  // Variable para indicar si se está editando un alumno existente.

function calculateIMC(peso, altura) {
    return (peso / ((altura / 100) * (altura / 100))).toFixed(2);
}

function getIMCStatus(imc) {
    if (imc < 25) {
        return "Normal";
    } else if (imc >= 25 && imc <= 30) {
        return "Sobrepeso";
    } else {
        return "Obeso";
    }
}

function showData() {
    var peopleList;
    if(localStorage.getItem("peopleList") == null){
        peopleList = [];
    }
    else{
        peopleList = JSON.parse(localStorage.getItem("peopleList"));
    }

    var html = "";

    peopleList.forEach(function (element, index) {
        var imc = calculateIMC(element.peso, element.altura);
        var imcStatus = getIMCStatus(imc);

        html += "<tr>";
        html += "<td>" + element.apellido + "</td>";
        html += "<td>" + element.legajo + "</td>";
        html += "<td>" + element.sexo + "</td>";
        html += "<td>" + element.peso + "</td>";
        html += "<td>" + element.altura + "</td>";
        html += "<td>" + imc + " (" + imcStatus + ")</td>";
        html +=
            '<td><button onclick="deleteData(' +
            index +
            ')" class="btn btn-danger">Borrar</button><button onclick="updateData(' +
            index +
            ')" class="btn btn-warning m-2">Editar</button></td>';
        html += "</tr>";
    });

    document.querySelector("#crudTable tbody").innerHTML = html;
}

document.addEventListener("DOMContentLoaded", function() {
    showData();
});

function addData(){
    if(validateForm() == true){
        var apellido = document.getElementById("apellido").value;
        var legajo = document.getElementById("legajo").value;
        var sexo = document.getElementById("sexo").value;
        var peso = document.getElementById("peso").value;
        var altura = document.getElementById("altura").value;

        var peopleList;
        if(localStorage.getItem("peopleList") == null){
            peopleList = [];
        } else{
            peopleList = JSON.parse(localStorage.getItem("peopleList"));
        }

        peopleList.push({
            "apellido": apellido,
            "legajo" : legajo,
            "sexo" : sexo,
            "peso" : peso,
            "altura" : altura
        });

        localStorage.setItem("peopleList", JSON.stringify(peopleList));
        showData();

        document.getElementById("apellido").value = "";
        document.getElementById("legajo").value = "";
        document.getElementById("sexo").value = "";
        document.getElementById("peso").value = "";
        document.getElementById("altura").value = "";
    }
}

function deleteData(index){
    var peopleList;
    if(localStorage.getItem("peopleList") == null){
        peopleList = [];
    }
    else{
        peopleList = JSON.parse(localStorage.getItem("peopleList"));
    }

    peopleList.splice(index, 1);
    localStorage.setItem("peopleList", JSON.stringify(peopleList));
    showData();
}

function updateData(index){
    document.getElementById("Submit").style.display = "none";
    document.getElementById("Update").style.display = "block";

    var peopleList;
    if(localStorage.getItem("peopleList") == null){
        peopleList = [];
    }
    else{
        peopleList = JSON.parse(localStorage.getItem("peopleList"));
    }

    document.getElementById("apellido").value = peopleList[index].apellido;
    document.getElementById("legajo").value = peopleList[index].legajo;
    document.getElementById("sexo").value = peopleList[index].sexo;
    document.getElementById("peso").value = peopleList[index].peso;
    document.getElementById("altura").value = peopleList[index].altura;

    // Configurar la variable de edición existente.
    editingExistingStudent = true;

    document.querySelector("#Update").onclick = function(){
        if(validateForm() == true){
            peopleList[index].apellido = document.getElementById("apellido").value;
            peopleList[index].legajo = document.getElementById("legajo").value;
            peopleList[index].sexo = document.getElementById("sexo").value;
            peopleList[index].peso = document.getElementById("peso").value;
            peopleList[index].altura = document.getElementById("altura").value;

            localStorage.setItem("peopleList", JSON.stringify(peopleList));

            showData();

            // Restablecer la variable de edición existente.
            editingExistingStudent = false;

            document.getElementById("apellido").value = "";
            document.getElementById("legajo").value = "";
            document.getElementById("sexo").value = "";
            document.getElementById("peso").value = "";
            document.getElementById("altura").value = "";

            document.getElementById("Submit").style.display = "block";
            document.getElementById("Update").style.display = "none";
        }
    }
}