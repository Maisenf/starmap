import json
import re
import sqlite3

def hms_to_degrees(hms):
    if not hms:
        return None
    try:
        h, m, s = map(float, hms.split(':'))
    except ValueError:
        return None
    return (h + m / 60 + s / 3600) * 15

def dms_to_degrees(dms):
    if not dms:
        return None
    dms = dms.strip()  # Whitespace entfernen, um negatives Format korrekt zu erkennen
    pattern = r"([+-]?\d+):(\d+):([\d.]+)"
    match = re.match(pattern, dms)
    if not match:
        return None
    d, m, s = map(float, match.groups())
    sign = -1 if d < 0 else 1
    return sign * (abs(d) + m / 60 + s / 3600)

# Array der Messier-Objekte mit Bildpfad und englischem Namen
messier_images = [
    {"messier": "M1",   "image": "M1.webp",   "english_name": "Crab Nebula"},
    {"messier": "M16",  "image": "M16.webp",  "english_name": "Eagle Nebula"},
    {"messier": "M31",  "image": "M31.webp",  "english_name": "Andromeda Galaxy"},
    {"messier": "M42",  "image": "M42.webp",  "english_name": "Orion Nebula"},
    {"messier": "M51",  "image": "M51.webp",  "english_name": "Whirlpool Galaxy"},
    {"messier": "M57",  "image": "M57.webp",  "english_name": "Ring Nebula"},
    {"messier": "M63",  "image": "M63.webp",  "english_name": "Sunflower Galaxy"},
    {"messier": "M64",  "image": "M64.webp",  "english_name": "Black Eye Galaxy"},
    {"messier": "M77",  "image": "M77.webp",  "english_name": "Seyfert Galaxy"},
    {"messier": "M81",  "image": "M81.webp",  "english_name": "Bode's Galaxy"},
    {"messier": "M82",  "image": "M82.webp",  "english_name": "Cigar Galaxy"},
    {"messier": "M83",  "image": "M83.webp",  "english_name": "Southern Pinwheel Galaxy"},
    {"messier": "M91",  "image": "M91.webp",  "english_name": "Spiral Galaxy"},
    {"messier": "M94",  "image": "M94.webp",  "english_name": "Croc's Eye Galaxy"},
    {"messier": "M96",  "image": "M96.webp",  "english_name": "Spiral Galaxy"},
    {"messier": "M101", "image": "M101.webp", "english_name": "Pinwheel Galaxy"},
    {"messier": "M104", "image": "M104.webp", "english_name": "Sombrero Galaxy"}
]

# Laden der JSON-Daten aus der Datei
with open('catalogue-de-messier.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

messier_array = []
for obj in data:
    # Suche in messier_images nach einem passenden Eintrag
    image_entry = next((img for img in messier_images if img["messier"] == obj["messier"]), None)
    # Falls vorhanden: englischer Name aus messier_images, sonst None
    english_name = image_entry["english_name"] if image_entry and "english_name" in image_entry else None
    new_obj = {
        "messier": obj["messier"],
        "english_name": english_name,
        "ra": hms_to_degrees(obj.get("ra")),
        "dec": dms_to_degrees(obj.get("dec")),
        "mag": obj.get("mag")
    }
    if image_entry:
        new_obj["image"] = "./img/" + image_entry["image"]
    messier_array.append(new_obj)

# Sortieren nach numerischem Wert der Messier-Nummer
messier_array = sorted(messier_array, key=lambda x: int(x["messier"].replace("M", "")))

# Verbindung zur SQLite-Datenbank herstellen (hier: ../../data.db)
conn = sqlite3.connect('../data.db')
cursor = conn.cursor()

# Einfügen (bzw. Ersetzen) der Daten in die Tabelle MessierObjects
for obj in messier_array:
    cursor.execute('''
        INSERT OR REPLACE INTO MessierObjects (Messier, EnglishName, RA, Dec, Magnitude, Image)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', (
        obj["messier"],
        obj["english_name"],
        obj["ra"],
        obj["dec"],
        obj["mag"],
        obj.get("image")
    ))

conn.commit()
conn.close()

print("Die Daten wurden erfolgreich in der SQLite-Datenbank gespeichert!")
