import json
import sqlite3
from astroquery.jplhorizons import Horizons

def fetch_and_store_kepler_data(planet_ids, epochs, location="500@10"):
    # Verbindung zur SQLite-Datenbank (neu anlegen, falls nicht vorhanden)
    conn = sqlite3.connect('../data.db')

    cursor = conn.cursor()

    # Für jeden Planeten die Keplerschen Daten abrufen
    for pid in planet_ids:
        obj = Horizons(id=pid, location=location, epochs=epochs)
        # Hole die Keplerschen Elemente
        elements_table = obj.elements()
        # Hole zusätzlich die Ephemeriden-Daten (enthält z. B. den scheinbaren Magnitudenwert)
        ephem_table = obj.ephemerides()

        # Umwandeln in Pandas DataFrames
        elements_df = elements_table.to_pandas()
        ephem_df = ephem_table.to_pandas()

        # Merge beider Tabellen anhand des gemeinsamen Zeitstempels "datetime_jd"
        merged_df = elements_df.merge(
            ephem_df[["datetime_jd", "V"]],
            on="datetime_jd",
            how="left"
        )

        # Behalte nur die benötigten Spalten
        columns_to_keep = [
            "targetname",  # -> TargetName
            "datetime_jd", # -> DatetimeJD
            "a",           # -> SemiMajorAxis
            "e",           # -> Eccentricity
            "incl",        # -> Inclination
            "Omega",       # -> LongitudeAscendingNode
            "w",           # -> ArgumentPeriapsis
            "Tp_jd",       # -> TimePeriapsisJD
            "n",           # -> MeanMotion
            "M",           # -> MeanAnomaly
            "V"            # -> VisualMagnitude
        ]
        merged_df = merged_df[columns_to_keep]

        # Füge jede Zeile in die Datenbank ein
        for _, row in merged_df.iterrows():
            values = (
                row["targetname"],
                row["datetime_jd"],
                row["a"],
                row["e"],
                row["incl"],
                row["Omega"],
                row["w"],
                row["Tp_jd"],
                row["n"],
                row["M"],
                row["V"]
            )
            cursor.execute('''
                INSERT OR REPLACE INTO Planets (
                    TargetName,
                    DatetimeJD,
                    SemiMajorAxis,
                    Eccentricity,
                    Inclination,
                    LongitudeAscendingNode,
                    ArgumentPeriapsis,
                    TimePeriapsisJD,
                    MeanMotion,
                    MeanAnomaly,
                    VisualMagnitude
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', values)
        print(f"Keplersche Daten für Planet-ID {pid} geladen und in die Datenbank eingefügt.")

    conn.commit()
    conn.close()
    print(f"Die Keplerschen Daten wurden in der SQLite-Datenbank '{db_file}' in der Tabelle 'Planets' gespeichert.")


if __name__ == "__main__":
    # Liste der Planet-IDs (ggf. erweiterbar)
    planet_ids = ["199", "299", "399", "499", "599", "699", "799", "899"]
    epochs = {"start": "2023-01-01", "stop": "2025-01-01", "step": "30d"}
    fetch_and_store_kepler_data(planet_ids, epochs)
