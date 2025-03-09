async function getStars(db, maxMagnitude) {
  const stmt = db.prepare("SELECT * FROM Stars WHERE Vmag < :max");
  stmt.bind({ ":max": maxMagnitude });

  const results = [];
  while (stmt.step()) {
    results.push(stmt.getAsObject());
  }

  stmt.free();
  return results;
}

async function getMessierObjects(db) {
  const stmt = db.prepare("SELECT * FROM MessierObjects WHERE Image IS NOT NULL");

  const results = [];
  while (stmt.step()) {
    results.push(stmt.getAsObject());
  }

  stmt.free();
  return results;
}

async function getConstellations(db) {
  const stmt = db.prepare("SELECT * FROM Constellations");

  const results = [];
  while (stmt.step()) {
    results.push(stmt.getAsObject());
  }

  stmt.free();
  return results;
}

async function getCountry(db, input) {
  if (input === ""){
    input = "DEU";
  }
  const stmt = db.prepare("SELECT * FROM Countries WHERE :input = Name OR :input = ISO");
  return stmt.getAsObject({ ":input": input });
}

async function getPlanets(db) {
  const stmt = db.prepare("SELECT * FROM Planets");

  const results = [];
  while (stmt.step()) {
    results.push(stmt.getAsObject());
  }

  stmt.free();
  const grouped = results.reduce((acc, current) => {
    const key = current.TargetName;
    if (!acc[key]) {
      acc[key] = []; 
    }
    acc[key].push(current); 
    return acc;
  }, {}); 

  return Object.values(grouped);
}
