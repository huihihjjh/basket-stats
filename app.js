import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const playersRef = collection(window.db, "players");
let players = [];

async function loadPlayers() {
  const snap = await getDocs(playersRef);
  players = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  render();
}

window.addPlayer = async function () {
  const input = document.getElementById("playerName");
  if (!input.value) return;

  await addDoc(playersRef, {
    name: input.value,
    dobles: 0,
    triples: 0,
    asistencias: 0,
    rebotes: 0,
    tapones: 0,
    pases: 0
  });

  input.value = "";
  loadPlayers();
};

window.addStat = async function (id, stat) {
  const p = players.find(j => j.id === id);
  p[stat]++;

  await updateDoc(doc(window.db, "players", id), {
    [stat]: p[stat]
  });

  loadPlayers();
};

function puntos(p) {
  return p.dobles * 2 + p.triples * 3;
}

function render() {
  const div = document.getElementById("players");
  div.innerHTML = "";

  players.forEach(p => {
    div.innerHTML += `
      <div class="player">
        <b>${p.name}</b><br>
        Puntos: ${puntos(p)}<br>
        +2 ${p.dobles} | +3 ${p.triples}<br>
        AST ${p.asistencias} | REB ${p.rebotes} | TAP ${p.tapones} | PAS ${p.pases}<br>
        <button onclick="addStat('${p.id}','dobles')">+2</button>
        <button onclick="addStat('${p.id}','triples')">+3</button>
        <button onclick="addStat('${p.id}','asistencias')">AST</button>
        <button onclick="addStat('${p.id}','rebotes')">REB</button>
        <button onclick="addStat('${p.id}','tapones')">TAP</button>
        <button onclick="addStat('${p.id}','pases')">PAS</button>
      </div>
    `;
  });
}

loadPlayers();