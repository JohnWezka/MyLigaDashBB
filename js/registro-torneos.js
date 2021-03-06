/*firebase.initializeApp({
  apiKey: "AIzaSyCrrASgB21Xwu1HKPkEMxyJRtSsrgGyr1g",
  authDomain: "myleague-5a9c8.firebaseapp.com",
  databaseURL: "https://myleague-5a9c8.firebaseio.com",
  projectId: "myleague-5a9c8",
  storageBucket: 'gs://myleague-5a9c8.appspot.com/',
  messagingSenderId: "167455229801"
});*/

var db = firebase.firestore();


var idLiga;

(function user() {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      db.collection("admin").where("userID", "==", user.uid).get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          idLiga = doc.data().idliga;
          leerTorneos();
        });
        var contenedor = document.getElementById('contCarga');
        contenedor.style.visibility = 'hidden';
        contenedor.style.opacity = '0';
      });
    } else {
      var contenedor = document.getElementById('contCarga');
      contenedor.style.visibility = 'hidden';
      contenedor.style.opacity = '0';
      location.href = "../login/index.html";
    }
  });
})();



function crearTorneo() {
  console.log(idLiga);
  var contenedor = document.getElementById('contCarga');
  contenedor.style.visibility = 'visible';
  contenedor.style.opacity = '100';

  var nombreTorneo = document.getElementById('nombreTorneo').value;
  var tipoTorneo = document.getElementById('tipoTorneo').value;
  var fechaInicio = document.getElementById('fechaInicio').value;
  var fechaCierre = document.getElementById('fechaCierre').value;
  var fechaNacimientoInicio = document.getElementById('fechaNacimientoInicio').value;
  var fechaNacimientoFinal = document.getElementById('fechaNacimientoFinal').value;
  var categoria = document.getElementById('Categoria').value;


  db.collection("torneo").add({
    nombreTorneo: nombreTorneo,
    tipoTorneo: tipoTorneo,
    idLiga: idLiga,
    fechaInicio: fechaInicio,
    fechaCierre: fechaCierre,
    fechaNacimientoInicio: fechaNacimientoInicio,
    fechaNacimientoFinal: fechaNacimientoFinal,
    categoria: categoria
  }).then(function (docRef) {
    console.log("Document written with ID: ", docRef.id);
    var washingtonRef = db.collection("torneo").doc(docRef.id);
    return washingtonRef.update({
      id: docRef.id
    }).then(function () {
      console.log("Document successfully updated!");
      document.getElementById('nombreTorneo').value = '';
      document.getElementById('tipoTorneo').value = '';
      document.getElementById('fechaInicio').value = '';
      document.getElementById('fechaCierre').value = '';
      document.getElementById('fechaNacimientoInicio').value = '';
      document.getElementById('fechaNacimientoFinal').value = '';
      document.getElementById('Categoria').value = '';

      var contenedor = document.getElementById('contCarga');
      contenedor.style.visibility = 'hidden';
      contenedor.style.opacity = '0';
      //window.location = "../index.html";
    }).catch(function (error) {
      console.error("Error updating document: ", error);
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

function limpiar() {

  document.getElementById('nombreTorneo').value = '';
  document.getElementById('tipoTorneo').value = '';
  document.getElementById('fechaInicio').value = '';
  document.getElementById('fechaCierre').value = '';
  document.getElementById('fechaNacimientoInicio').value = '';
  document.getElementById('fechaNacimientoFinal').value = '';
  document.getElementById('fechaNacimientoFinal').value = '';
  var boton = document.getElementById('categoria');
  boton.innerHTML = 'Guardar';
  boton.onclick = function () {
    crearTorneo();
  }
}

function leerTorneos() {
  var tabla = document.getElementById('tabla');
  tabla.innerHTML = '';
  db.collection("torneo").where("idLiga", "==", idLiga).onSnapshot((querySnapshot) => {
    tabla.innerHTML = '';
    querySnapshot.forEach((doc) => {
      tabla.innerHTML += `
          <tr>
          <th scope="row">${doc.data().nombreTorneo}</th>
          <td>${doc.data().tipoTorneo}</td>
          <td>${doc.data().fechaInicio}</td>
          <td>${doc.data().fechaCierre}</td>
          <td>${doc.data().fechaNacimientoInicio}</td>
          <td>${doc.data().fechaNacimientoFinal}</td>
          <td>${doc.data().categoria}</td>
          <td class="center"><h4 class="center" href="#"><i class="fas fa-sync-alt modal-trigger deep-purple-text text-accent-4"
                href="#modal1" onclick="actualizarTorneo('${doc.id}','${doc.data().nombreTorneo}',
          '${doc.data().fechaInicio}','${doc.data().fechaCierre}','${doc.data().fechaNacimientoInicio}','${doc.data().fechaNacimientoFinal}','${doc.data().categoria}')"></i></h4></td>
          <td><h4 class="center" href="#"><i class="fas fa-trash-alt red-text text-accent-4" onclick="eliminarTorneo('${doc.id}')"></i></h4></td>
          </tr>`;
    });
    var contenedor = document.getElementById('contCarga');
    contenedor.style.visibility = 'hidden';
    contenedor.style.opacity = '0';
  }).catch(function (error) {
    console.log("Error getting documents: ", error);
    var contenedor = document.getElementById('contCarga');
    contenedor.style.visibility = 'hidden';
    contenedor.style.opacity = '0';
  });
}



function eliminarTorneo(id) {
  db.collection("torneo").doc(id).delete().then(function () {
  }).catch(function (error) {
    console.error("Error removing document: ", error);
  });
}

function actualizarTorneo(id, nombreTorneo, tipoTorneo, fechaInicio, fechaCierre, fechaNacimientoInicio, fechaNacimientoFinal, categoria) {
  console.log('entro');
  document.getElementById('nombreTorneo').value = nombreTorneo;
  document.getElementById('tipoTorneo').value = tipoTorneo;
  document.getElementById('fechaInicio').value = fechaInicio;
  document.getElementById('fechaCierre').value = fechaCierre;
  document.getElementById('fechaNacimientoInicio').value = fechaNacimientoInicio;
  document.getElementById('fechaNacimientoFinal').value = fechaNacimientoFinal;
  document.getElementById('categoria').value = categoria;
  var boton = document.getElementById('boton');
  boton.innerHTML = 'Editar';
  boton.onclick = function () {

    var washingtonRef = db.collection("torneo").doc(id);
    var nombreTorneo = document.getElementById('nombreTorneo').value;
    var tipoTorneo = document.getElementById('tipoTorneo').value;
    var fechaInicio = document.getElementById('fechaInicio').value;
    var fechaCierre = document.getElementById('fechaCierre').value;
    var fechaNacimientoInicio = document.getElementById('fechaNacimientoInicio').value;
    var fechaNacimientoFinal = document.getElementById('fechaNacimientoFinal').value;
    var categoria = document.getElementById('categoria').value;

    return washingtonRef.update({
      nombreTorneo: nombreTorneo,
      tipoTorneo: tipoTorneo,
      fechaInicio: fechaInicio,
      fechaCierre: fechaCierre,
      fechaNacimientoInicio: fechaNacimientoInicio,
      fechaNacimientoFinal: fechaNacimientoFinal,
      categoria: categoria

    }).then(function () {
      console.log("Document succesfully updated!");
      document.getElementById('nombreTorneo').value = '';
      document.getElementById('tipoTorneo').value = '';
      document.getElementById('fechaInicio').value = '';
      document.getElementById('fechaCierre').value = '';
      document.getElementById('fechaNacimientoInicio').value = '';
      document.getElementById('fechaNacimientoFinal').value = '';
      document.getElementById('categoria').value = '';
      window.location = "Torneos.html";
    }).catch(function (error) {
      console.error("Error updating document: ", error);
    })
  }
}