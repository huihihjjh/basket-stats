const input = document.getElementById("nombre");
const boton = document.getElementById("agregar");
const lista = document.getElementById("lista");
const ranking = document.getElementById("ranking");

/* AGREGAR JUGADOR */
boton.addEventListener("click", () => {
  const nombre = input.value.trim();
  if (nombre === "") return;

  db.collection("jugadores").add({
    nombre: nombre,
    puntos: 0,
    dobles: 0,
    triples: 0,
    asistencias: 0,
    rebotes: 0,
    creado: Date.now()
  });

  input.value = "";
});

/* LISTA DE JUGADORES */
db.collection("jugadores")
  .orderBy("creado")
  .onSnapshot(snapshot => {
    lista.innerHTML = "";

    snapshot.forEach(doc => {
      const j = doc.data();
      const li = document.createElement("li");

      li.innerHTML = `
        <strong>${j.nombre}</strong><br>
        🏀 ${j.puntos} pts |
        2️⃣ ${j.dobles} |
        3️⃣ ${j.triples} |
        AST ${j.asistencias} |
        REB ${j.rebotes}
        <br>
        <button onclick="doble('${doc.id}')">+2</button>
        <button onclick="triple('${doc.id}')">+3</button>
        <button onclick="asistencia('${doc.id}')">+AST</button>
        <button onclick="rebote('${doc.id}')">+REB</button>
        <button onclick="borrar('${doc.id}')">🗑️</button>
        <hr>
      `;

      lista.appendChild(li);
    });
  });

/* RANKING AUTOMÁTICO (SOLO PUNTOS) */
db.collection("jugadores")
  .orderBy("puntos", "desc")
  .onSnapshot(snapshot => {
    ranking.innerHTML = "";

    let puesto = 1;
    snapshot.forEach(doc => {
      const j = doc.data();
      const li = document.createElement("li");
      li.textContent = `${puesto}. ${j.nombre} — ${j.puntos} pts`;
      ranking.appendChild(li);
      puesto++;
    });
  });

/* FUNCIONES */
function doble(id) {
  db.collection("jugadores").doc(id).update({
    puntos: firebase.firestore.FieldValue.increment(2),
    dobles: firebase.firestore.FieldValue.increment(1)
  });
}

function triple(id) {
  db.collection("jugadores").doc(id).update({
    puntos: firebase.firestore.FieldValue.increment(3),
    triples: firebase.firestore.FieldValue.increment(1)
  });
}

function asistencia(id) {
  db.collection("jugadores").doc(id).update({
    asistencias: firebase.firestore.FieldValue.increment(1)
  });
}

function rebote(id) {
  db.collection("jugadores").doc(id).update({
    rebotes: firebase.firestore.FieldValue.increment(1)
  });
}

function borrar(id) {
  if (!confirm("¿Borrar jugador?")) return;
  db.collection("jugadores").doc(id).delete();
}