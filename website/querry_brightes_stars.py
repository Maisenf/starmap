from astroquery.vizier import Vizier

vizier = Vizier(columns=["HIP", "RAICRS", "DEICRS", "Plx", "B-V", "Vmag"])
vizier.ROW_LIMIT = 600
result = vizier.query_constraints(catalog=["I/239/hip_main"], Vmag="<4")

if result:
    df = result[0].to_pandas()
    df = df.sort_values(by="Vmag", ascending=True)
    df = df.rename(columns={"B-V": "BV"})
    json_data = df.to_json(orient="records", force_ascii=False)

    with open("js/stars.js", "w", encoding="utf-8") as f:
        f.write("window.jsonData = " + json_data + ";")

    print("index.js-Datei erfolgreich gespeichert!")
else:
    print("Keine Ergebnisse gefunden.")
