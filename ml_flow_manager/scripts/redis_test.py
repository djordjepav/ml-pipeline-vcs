import redis


red = redis.StrictRedis(host='localhost', port=6379)

sub = red.pubsub()
sub.subscribe("roomA")
red.publish("roomA","fsdfsf")

loop = True

while loop:
    message = sub.get_message()
    if message:
        print(message)
        if message['data'] == b'stop':
            loop = False

        message = None

print('Process stopped...')
