--HELLO--

Step 1) Restore the SQL dump file. IF the geometries are not recognised, remove all dummy entries and delete the geometry column. Then readd the geometry column using PostGIS

step 2) Place the Python script in the CGI folder on your apache server or in the /home folder on your server.

Step 3) Change the login details for the database in the python script as well as the host URL.

Step 4) Set up Geoserver with OGC WFS 2.0 and JSONP for Javascript.

Step 5) Change the Javascript (Websocket) and PHP files (SQL Query) to suit your database settings and geoserver as adjusted above.

Step 6) Place the files into the www directory of your apache server