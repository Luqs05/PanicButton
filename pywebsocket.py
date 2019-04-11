import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
import eventlet
from eventlet import wsgi
from eventlet import websocket
from eventlet.hubs import trampoline

#Change these according to your database
dsn = 'dbname=devgroup3 user=postgres password=Raeesah1'  

def dblisten(q):
    #Open a connection, add notifications to *q*.
    cnn = psycopg2.connect(dsn)
    cnn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
    cur = cnn.cursor()
    cur.execute("LISTEN data;")
    while 1:
        trampoline(cnn, read=True)
        cnn.poll()
        while cnn.notifies:
            n = cnn.notifies.pop()
            q.put(n)

@websocket.WebSocketWSGI
def handle(ws):
    #Receive a connection and send it database notifications.
    q = eventlet.Queue()
    eventlet.spawn(dblisten, q)
    while 1:
        n = q.get()
        ws.send(unicode(n.payload))

def dispatch(environ, start_response):
    if environ['PATH_INFO'] == '/data':
        return handle(environ, start_response)
    else:
        start_response('200 OK',
            [('content-type', 'text/html')])
        return [page]

#Change the URL to that of your own server or name it 127.0.0.1, leave the port as 7000.
if __name__ == "__main__":
    listener = eventlet.listen(('41.185.93.71', 7000))
    wsgi.server(listener, dispatch)
