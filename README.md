# Starmap with real data

This is the current skymap based on your country you specified (English name or iso code) or use lat/lon coordinates. I wrote this in js using data from the Hipparcos main catalog.

I removed the helper scripts and data from the Steam publication because it's just to fill the db with data. You don't have to run the helper scripts, but to get more stars you can edit (Vmag = Magnitude -> higher Value shows more stars) the querry_brieghtest_stars.py. You need to write the db in a base54 string and put it in the data.js file, beacuse i wanted this to work without a web server in plain html/js. I used the sql.js lib to querry the db.

The wallpaper works perfectly with the wallpaper engine (Windows), but you can also use it with Plash (Mac / default location is Berlin).

Data Credits

- star and planets data from Vizier (https://vizier.cds.unistra.fr/viz-bin/VizieR)
- Messier catalogue (https://www.datastro.eu/explore/dataset/catalogue-de-messier/export/?disjunctive.objet&disjunctive.mag&disjunctive.english_name_nom_en_anglais&disjunctive.french_name_nom_francais&disjunctive.latin_name_nom_latin)
- Constellation Data from stellarium (https://github.com/Stellarium/stellarium/blob/master/skycultures/modern_iau/index.json)
- Country Data (https://datahub.io/core/geo-countries#data-previews) 

Image Credits (Messier-Objects)

- Messier Images: NASA, ESA, and the Hubble Heritage Team (STScI/AURA)
(https://science.nasa.gov/mission/hubble/science/explore-the-night-sky/hubble-messier-catalog/)
- Andromeda Image (post-2002): © Robert Gendler (https://esahubble.org/images/heic0512d/)

![alt text](/website/preview.jpg)
