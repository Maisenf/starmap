from astroquery.vizier import Vizier
import sqlite3
import pandas as pd

brightest_stars = {
    32349: "Sirius",
    30438: "Canopus",
    71683: "Rigil Kentaurus",
    69673: "Arcturus",
    91262: "Vega",
    24608: "Capella",
    24436: "Rigel",
    37279: "Procyon",
    7588: "Achernar",
    27989: "Betelgeuse",
    68702: "Hadar",
    97649: "Altair",
    60718: "Acrux",
    21421: "Aldebaran",
    65474: "Spica",
    80763: "Antares",
    37826: "Pollux",
    113368: "Fomalhaut",
    62434: "Mimosa",
    102098: "Deneb",
    49669: "Regulus",
    33579: "Adhara",
    61084: "Gacrux",
    85927: "Shaula",
    25336: "Bellatrix",
    25428: "Elnath",
    45238: "Miaplacidus",
    31681: "Alhena",
    39953: "Kaus Australis",
    41037: "Avior",
    42913: "Alsephina",
    46390: "Alphard",
    54061: "Dubhe",
    62956: "Alioth",
    67301: "Alkaid",
    100751: "Peacock",
    109268: "Alnair",
    11767: "Polaris",
    15863: "Mirphak",
    28360: "Menkalinan",
    34444: "Wezen",
    82273: "Atria",
    86228: "Sargas",
    17702: "Pleiades",
    36850: "Castor",
    27366: "Saiph",
    746: "Caph",
    677: "Alpheratz",
    113881: "Scheat",
    113963: "Markab",
    14576: "Algol",
    9884: "Hamal",
    14135: "Menkar",
    5447: "Mirach",
    9640: "Almaak",
    117221: "Alfirk",
    1067: "Algenib",
    2081: "Ankaa",
    3419: "Diphda",
    95947: "Albireo",
    107315: "Enif",
    76267: "Alphekka",
    98036: "Alshain",
    72607: "Kochab",
    77070: "Unukalhai",
    68756: "Thuban",
    87833: "Etamin",
    112122: "Sadr",
    112029: "Gienah",
    102488: "Ruchbah",
    65378: "Mizar",
    58001: "Phecda",
}

# Eigennamenfunktion
def get_custom_name(hip):
    return brightest_stars.get(int(hip), None)

# Vizier-Konfiguration
vizier = Vizier(columns=["HIP", "RAICRS", "DEICRS", "Plx", "B-V", "Vmag"])
vizier.ROW_LIMIT = -1

# Abfrage Hipparcos-Katalog
hip_result = vizier.query_constraints(catalog=["I/239/hip_main"], Vmag="<5")

if hip_result:
    df = hip_result[0].to_pandas()
    df.rename(columns={"B-V": "BV"}, inplace=True)
    df.sort_values(by="Vmag", ascending=True, inplace=True)
    df["HIP"] = df["HIP"].astype(int)

    # Bayer-Bezeichnungen
    bayer_vizier = Vizier(columns=["HIP", "Bayer", "Cst"])
    bayer_vizier.ROW_LIMIT = -1
    print("Frage Bayer-Bezeichnungen ab ...")
    hip_list = df["HIP"].astype(str).unique().tolist()

    try:
        bayer_result = bayer_vizier.query_constraints(catalog="IV/27A", HIP=hip_list)
        if bayer_result:
            print("Bayer-Ergebnisse gefunden.")
        else:
            print("Keine Bayer-Ergebnisse gefunden.")
    except Exception as e:
        print("Fehler beim Abfragen der Bayer-Bezeichnungen:", e)
        bayer_result = None


    if bayer_result:
        df_bayer = bayer_result[0].to_pandas()
        df_bayer["HIP"] = df_bayer["HIP"].astype(int)

        # Merge mit df
        df = df.merge(df_bayer[["HIP", "Bayer", "Cst"]], on="HIP", how="left")

        # BayerName erzeugen
        df["BayerName"] = df.apply(
            lambda row: f"{row['Bayer']} {row['Cst']}" if pd.notnull(row["Bayer"]) and pd.notnull(row["Cst"]) else None,
            axis=1
        )

        # Kombinierter Name (Custom > BayerName)
        df["Name"] = df.apply(lambda row: get_custom_name(row["HIP"]) or row["BayerName"], axis=1)
        print(bayer_result)
    else:
        # Kein Bayer-Ergebnis → nur Custom-Namen
        df["Name"] = df["HIP"].apply(get_custom_name)

    # Verbindung zur DB
    conn = sqlite3.connect('./website/data.db')
    cursor = conn.cursor()

    for _, row in df.iterrows():
        cursor.execute("""
            INSERT OR REPLACE INTO Stars (HIP, Name, RAICRS, DEICRS, Plx, BV, Vmag)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (
            int(row["HIP"]),
            row["Name"],
            row["RAICRS"],
            row["DEICRS"],
            row["Plx"],
            row["BV"],
            row["Vmag"],
        ))

    conn.commit()
    conn.close()
    print("Die Sterne wurden erfolgreich eingetragen.")
else:
    print("Keine Ergebnisse aus dem Hipparcos-Katalog gefunden.")