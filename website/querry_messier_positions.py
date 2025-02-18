from astroquery.vizier import Vizier
from astropy.coordinates import SkyCoord
import astropy.units as u
import pandas as pd

# VizieR-Katalog mit Messier-Objekten (NGC/IC)
catalog = "VII/118/ngc2000"

# Abfrage für alle Messier-Objekte
vizier = Vizier(columns=["M", "RAJ2000", "DEJ2000"])  # Spalten: Messier-Nummer, Rektaszension, Deklination
vizier.ROW_LIMIT = -1  # Keine Begrenzung der Zeilenanzahl

# Daten abrufen
result = vizier.query_constraints(catalog=catalog, M="1..110")  # Alle Messier-Objekte (M1 bis M110)

# Konvertiere in DataFrame für bessere Übersicht
if result:
    data = result[0].to_pandas()
    json_data = df.to_json(orient="records", force_ascii=False)

    with open("js/galaxies.js", "w", encoding="utf-8") as f:
        f.write("const jsonDataGalaxies = " + json_data + ";")
else:
    print("Keine Daten gefunden.")
