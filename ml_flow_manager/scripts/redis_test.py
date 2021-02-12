import redis


red = redis.StrictRedis(host='localhost', port=6379)

sub = red.pubsub()
sub.subscribe(15)

loop = True

while loop:
    message = sub.get_message()
    if message:
        print(message['data'])
        if message['data'] == b'stop':
            loop = False

        message = None

print('Process stopped...')
