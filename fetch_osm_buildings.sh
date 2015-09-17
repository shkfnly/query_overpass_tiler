#!/bin/bash
rm buildings*
rm osm.xml
python fetch_osm_xml.py
DBNAME=$$
createdb -T template_postgis $DBNAME
osm2pgsql -S building.style -d $DBNAME osm.xml
pgsql2shp -f buildings.shp $DBNAME planet_osm_polygon
dropdb $DBNAME
