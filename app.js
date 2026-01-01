const input = document.getElementById("nombre");
const boton = document.getElementById("agregar");
const lista = document.getElementById("lista");

boton.addEventListener("click", () => {
  console.log("CLICK");

  const nombre = input.value.trim();
  if (nombre === "") return;

  db.collection("jugadores").add({
    nombre: nombre,
    puntos: 0,
    triples: 0,
    dobles: 0,
    asistencias: 0,
    rebotes: 0,
    tapones: 0,
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
      li.textContent = `${j.nombre} - ${j.puntos} pts`;
      lista.appendChild(li);
    });
  });