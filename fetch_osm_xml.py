import urllib2
params = {'xmin': 47.349954, 'ymin': 18.904740,'xmax': 47.609765, 'ymax': 19.357775}
myOsmXmlUrlPath = ('http://overpass-api.de/api/interpreter?data=(node[%22building%22=%22yes%22](%(xmin)s,%(ymin)s,%(xmax)s,%(ymax)s);way[%22building%22=%22yes%22](%(xmin)s,%(ymin)s,%(xmax)s,%(ymax)s);relation[%22building%22=%22yes%22](%(xmin)s,%(ymin)s,%(xmax)s,%(ymax)s););(._;%3E;);out%20body;' % params)
# Note that osm json is NOT geojson!
myOsmJsonUrlPath = ('http://overpass-api.de/api/interpreter?data=[out:json];(node[%22building%22=%22yes%22](%(xmin)s,%(ymin)s,%(xmax)s,%(ymax)s);way[%22building%22=%22yes%22](%(xmin)s,%(ymin)s,%(xmax)s,%(ymax)s);relation[%22building%22=%22yes%22](%(xmin)s,%(ymin)s,%(xmax)s,%(ymax)s););(._;%3E;);out%20body;' % params)
myRequest = urllib2.Request(myOsmXmlUrlPath)
try:
    myUrlHandle = urllib2.urlopen(myRequest, timeout=60)
    myFile = file('osm.xml', 'wb')
    myFile.write(myUrlHandle.read())
    myFile.close()
except urllib2.URLError:
    raise
