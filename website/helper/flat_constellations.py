import sqlite3
import json

# JSON-Daten laden
with open("constellations.json", "r", encoding="utf-8") as f:
    data = json.load(f)

constellations_data = data.get("constellations", [])

# Verbindung zur SQLite-Datenbank herstellen
conn = sqlite3.connect('../data.db')
cursor = conn.cursor()


# Daten in die Datenbank einfügen
for constellation in constellations_data:
    iau_id = constellation.get("id")
    # Wähle beispielsweise den englischen Namen
    name = constellation.get("common_name", {}).get("english")
    lines = constellation.get("lines", [])
    
    # Umwandlung der 'lines' in ein Array von Paaren
    geometry_json = json.dumps(lines)
    
    cursor.execute("""
        INSERT OR REPLACE INTO Constellations 
        (iau_id, name, lines)
        VALUES (?, ?, ?)
    """, (iau_id, name, geometry_json))

conn.commit()
conn.close()