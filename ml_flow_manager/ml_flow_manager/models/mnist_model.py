from keras.datasets import mnist
from keras.layers import Dense, Flatten, Dropout
from keras.models import Sequential
from keras.utils import to_categorical

MODEL_PATH = '../../../mnist.h5'


def get_model():
    model = Sequential([
        Flatten(input_shape=(28, 28)),
        Dense(128, activation='relu'),
        Dropout(rate=0.05),
        Dense(64, activation='relu'),
        Dense(10, activation='softmax')
        ])

    return model


def train(filename=MODEL_PATH):
    (x_train, y_train), (x_test, y_test) = mnist.load_data()

    model = get_model()
    model.compile(loss='categorical_crossentropy', optimizer='adam', metrics=['accuracy'])
    model.fit(x=x_train, y=to_categorical(y_train, 10), epochs=10, batch_size=64, shuffle=True)
    model.save(filename)


def save_model(filename=MODEL_PATH):
    model = get_model()
    model.compile(loss='categorical_crossentropy', optimizer='adam', metrics=['accuracy'])
    model.save(filename)


if __name__ == '__main__':
    train()
    # save_model()
