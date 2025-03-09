import json
import sqlite3

# Lade die JSON-Daten aus der Datei
with open("countries.json", "r", encoding="utf-8") as f:
    data = json.load(f)

countries_data = data.get("data", [])


def extract_lat_lon(geometry):
    """
    Extrahiere Latitude und Longitude aus der Geometrie.
    Erwartet wird ein Aufbau wie: coordinates: [ [ [lon, lat], ... ] ]
    Falls lat oder lon Listen sind, wird das erste Element genommen.
    """
    lat, lon = None, None
    coordinates = geometry.get("coordinates")
    if coordinates and isinstance(coordinates, list):
        try:
            # Hier orientieren wir uns am Node-Code:
            # In Node: feature.geometry.coordinates[0][0][0]
            # Wir erwarten, dass coordinates[0][0] ein Punkt [lon, lat] ist.
            point = coordinates[0][0][0]
            if isinstance(point, list) and len(point) >= 2:
                lon = point[0]
                lat = point[1]
                # Falls lon oder lat Listen sind, nehme das erste Element
                if isinstance(lon, list):
                    lon = lon[0]
                if isinstance(lat, list):
                    lat = lat[0]
            else:
                lon, lat = None, None
        except Exception as e:
            lon, lat = None, None
    return lat, lon


# Erstelle eine Liste mit den relevanten Daten (Name, ISO, Latitude, Longitude)
countries_list = []
for feature in countries_data:
    properties = feature.get("properties", {})

    if properties.get("ISO_A3") != "-99":
        geometry = feature.get("geometry", {})

        name = properties.get("ADMIN")
        iso = properties.get("ISO_A3")
        lat, lon = extract_lat_lon(geometry)
        countries_list.append((name, iso, lat, lon))
# Verbindung zur SQLite-Datenbank herstellen (oder erstellen, falls sie noch nicht existiert)
conn = sqlite3.connect('../data.db')
cursor = conn.cursor()

# Tabelle "Countries" mit den Spalten: ID, Name, ISO, Latitude, Longitude erstellen
# Füge die Daten in die Tabelle ein
cursor.executemany(
    """
    INSERT OR REPLACE INTO Countries (Name, ISO, Latitude, Longitude)
    VALUES (?, ?, ?, ?)
""",
    countries_list,
)

conn.commit()
conn.close()

print(
    "Die Daten wurden erfolgreich in der SQLite-Datenbank 'countries.db' in der Tabelle 'Countries' gespeichert!"
)
