// Initialize Cloud Firestore through Firebase
var db = firebase.firestore();
var storage = firebase.storage();

var idLiga;

(function user() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {

            db.collection("admin").where("userID", "==", user.uid).get().then(function (querySnapshot) {
                querySnapshot.forEach(function (doc) {
                    user = doc.id;
                    idLiga = doc.data().idliga;
                    leerPartidos();
                });
            });
        } else {
            console.log("entro");

        }
    });
})();

(function leerEquipos() {
    var selection_roll = document.getElementById('local');
    var selection_roll2 = document.getElementById('visitante');
    selection_roll.innerHTML = '';
    selection_roll2.innerHTML = '';
    db.collection("equipos").get().then(function (querySnapshot) {
        selection_roll.innerHTML = '';
        selection_roll2.innerHTML = '';
        querySnapshot.forEach((doc) => {
            selection_roll.innerHTML += ` 
            <option>${doc.data().nombreEquipo}</option>`;
            selection_roll2.innerHTML += ` 
            <option>${doc.data().nombreEquipo}</option>`;
        });

    });
})();

function crearPartido() {
    var contenedor = document.getElementById('contCarga');
    contenedor.style.visibility = 'visible';
    contenedor.style.opacity = '100';

    var local = document.getElementById('local').value;
    var visitante = document.getElementById('visitante').value;
    var fecha = document.getElementById('fecha').value;
    var hora = document.getElementById('hora').value;
    var lugar = document.getElementById('lugar').value;
    var jornada = document.getElementById('jornada').value;

    db.collection("Partido").add({
        local: local,
        visitante: visitante,
        fecha: fecha,
        hora: hora,
        idLiga: idLiga,
        lugar: lugar,
        jornada: jornada,
    }).then(function (docRef) {
        console.log("Document written with ID: ", docRef.id);
        var washingtonRef = db.collection("Partido").doc(docRef.id);
        return washingtonRef.update({
            id: docRef.id
        }).then(function () {
            console.log("Document successfully updated!");
            document.getElementById('fecha').value = '';
            document.getElementById('hora').value = '';
            document.getElementById('lugar').value = '';
            document.getElementById('jornada').value = '';
            var contenedor = document.getElementById('contCarga');
            contenedor.style.visibility = 'hidden';
            contenedor.style.opacity = '0';
        }).catch((error) => {
            console.log(error);
            var contenedor = document.getElementById('contCarga');
            contenedor.style.visibility = 'hidden';
            contenedor.style.opacity = '0';
        });
    }).catch(function (error) {
        console.error("Error adding document: ", error);
        var contenedor = document.getElementById('contCarga');
        contenedor.style.visibility = 'hidden';
        contenedor.style.opacity = '0';
    });
}

function leerPartidos() {
    var tabla_arbitros = document.getElementById('tabla');
    tabla_arbitros.innerHTML = '';
    db.collection("Partido").where("idLiga", "==", idLiga).onSnapshot(function (querySnapshot) {
        tabla_arbitros.innerHTML = '';
        querySnapshot.forEach(function (doc) {
            tabla_arbitros.innerHTML += `
            <tr>
              <td>${doc.data().local}</td>
              <td>${doc.data().visitante}</td>
              <td>${doc.data().fecha}</td>
              <td>${doc.data().hora}</td>
              <td>${doc.data().lugar}</td>
              <td>${doc.data().jornada}</td>
              <td><h4 class="center"><i class="fas fa-sync-alt modal-trigger deep-purple-text text-accent-4"
              href="#modal1" onclick="actualizarPartido('${doc.id}','${doc.data().local}',
              '${doc.data().visitante}','${doc.data().fecha}','${doc.data().hora}','${doc.data().lugar}','${doc.data().jornada}')"></i></h4></td>
              <td><h4 class="center"><i class="fas fa-trash-alt red-text text-accent-4" onclick="eliminarPartido('${doc.id}')"></i></h4></td>
            </tr>
            `;
        });
        var contenedor = document.getElementById('contCarga');
        contenedor.style.visibility = 'hidden';
        contenedor.style.opacity = '0';
    })
}

function eliminarPartido(id) {
    db.collection("Partido").doc(id).delete().then(function () {
        console.log("Document successfully deleted!");
    }).catch(function (error) {
        console.error("Error removing document: ", error);
    });
}

function actualizarPartido(id, local, visitante, fecha, hora, lugar, jornada) {
    document.getElementById('local').value = local;
    document.getElementById('visitante').value = visitante;
    document.getElementById('fecha').value = fecha;
    document.getElementById('hora').value = hora;
    document.getElementById('lugar').value = lugar;
    document.getElementById('jornada').value = jornada;
    var boton = document.getElementById('boton');
    boton.innerHTML = 'Editar';
    boton.onclick = function () {
        var contenedor = document.getElementById('contCarga');
        contenedor.style.visibility = 'visible';
        contenedor.style.opacity = '100';
        var washingtonRef = db.collection("Partido").doc(id);
        var local = document.getElementById('local').value;
        var visitante = document.getElementById('visitante').value;
        var fecha = document.getElementById('fecha').value;
        var hora = document.getElementById('hora').value;
        var lugar = document.getElementById('lugar').value;
        var jornada = document.getElementById('jornada').value;
        return washingtonRef.update({
            local: local,
            visitante: visitante,
            fecha: fecha,
            hora: hora,
            lugar: lugar,
            jornada: jornada
        }).then(function () {
            console.log("Document succesfully updated!");
            document.getElementById('local').value = '';
            document.getElementById('visitante').value = '';
            document.getElementById('fecha').value = '';
            document.getElementById('hora').value = '';
            document.getElementById('lugar').value = '';
            document.getElementById('jornada').value = '';
            boton.innerHTML = 'Guardar';
            var contenedor = document.getElementById('contCarga');
            contenedor.style.visibility = 'hidden';
            contenedor.style.opacity = '0';
        }).catch(function (error) {
            console.error("Error updating document: ", error);
            var contenedor = document.getElementById('contCarga');
            contenedor.style.visibility = 'hidden';
            contenedor.style.opacity = '0';
        })
    }
}

function limpiar() {

    document.getElementById('hora').value = '';
    document.getElementById('fecha').value = '';
    document.getElementById('lugar').value = '';
    document.getElementById('jornada').value = '';
    var boton = document.getElementById('boton');
    boton.innerHTML = 'Guardar';
    boton.onclick = function () {
        crearPartido();
    }
}

document.addEventListener('DOMContentLoaded', function () {
    var elems = document.querySelectorAll('select');
    var instances = M.FormSelect.init(elems);
});