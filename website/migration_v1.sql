-- SQLite
CREATE TABLE Stars (
    HIP INTEGER PRIMARY KEY,
    Name TEXT,
    RAICRS REAL,
    DEICRS REAL,
    Plx REAL,
    BV REAL,
    Vmag REAL
);

CREATE TABLE Countries (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    Name TEXT UNIQUE,
    ISO TEXT UNIQUE,
    Latitude REAL,
    Longitude REAL
);

CREATE TABLE MessierObjects (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    Messier TEXT UNIQUE,
    EnglishName TEXT,
    RA REAL,
    Dec REAL,
    Magnitude REAL,
    Distance REAL,
    Image TEXT
);

CREATE TABLE Planets (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    TargetName TEXT,
    DatetimeJD REAL,
    SemiMajorAxis REAL,
    Eccentricity REAL,
    Inclination REAL,
    LongitudeAscendingNode REAL,
    ArgumentPeriapsis REAL,
    TimePeriapsisJD REAL,
    MeanMotion REAL,
    MeanAnomaly REAL,
    VisualMagnitude REAL
);

CREATE TABLE Constellations (
    id INTEGER PRIMARY KEY,
    iau_id TEXT UNIQUE,
    name TEXT,
    lines TEXT
);

DROP TABLE Stars;
DROP TABLE Planets;
DROP TABLE MessierObjects;
DROP TABLE Countries;
DROP TABLE Constellations;

SELECT * FROM MessierObjects WHERE Messier = 'M31';
