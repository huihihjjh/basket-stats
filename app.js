const input = document.getElementById("nombre");
const boton = document.getElementById("agregar");
const lista = document.getElementById("lista");

boton.addEventListener("click", () => {
  const nombre = input.value.trim();
  if (nombre === "") return;

  db.collection("jugadores").add({
    nombre: nombre,
    puntos: 0,
    asistencias: 0,
    rebotes: 0,
    creado: Date.now()
  });

  input.value = "";
});

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
        🤝 ${j.asistencias} ast |
        🔁 ${j.rebotes} reb
        <br>
        <button onclick="sumar('${doc.id}', 'puntos', 1)">+1</button>
        <button onclick="sumar('${doc.id}', 'puntos', 2)">+2</button>
        <button onclick="sumar('${doc.id}', 'puntos', 3)">+3</button>
        <button onclick="sumar('${doc.id}', 'asistencias', 1)">+AST</button>
        <button onclick="sumar('${doc.id}', 'rebotes', 1)">+REB</button>
        <button onclick="borrar('${doc.id}')">🗑️</button>
        <hr>
      `;

      lista.appendChild(li);
    });
  });

function sumar(id, campo, valor) {
  db.collection("jugadores").doc(id).update({
    [campo]: firebase.firestore.FieldValue.increment(valor)
  });
}

function borrar(id) {
  if (!confirm("¿Borrar jugador?")) return;

  db.collection("jugadores").doc(id).delete();
}