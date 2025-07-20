import base64

# Pfade definieren
input_file = "../data.db"
output_file = "../data.b64"

# Datei einlesen und in Base64 umwandeln
with open(input_file, "rb") as db_file:
    encoded = base64.b64encode(db_file.read())

# In eine .b64-Datei schreiben
with open(output_file, "wb") as out_file:
    out_file.write(encoded)

print(f"'{input_file}' wurde erfolgreich als Base64 in '{output_file}' gespeichert.")
