alert("JS cargó");

if (typeof firebase === "undefined") {
  alert("Firebase NO cargó");
} else {
  alert("Firebase SÍ cargó");
}

try {
  db.collection("prueba").add({
    ok: true,
    fecha: Date.now()
  });
  alert("Intenté escribir en Firestore");
} catch (e) {
  alert("Error: " + e.message);
}