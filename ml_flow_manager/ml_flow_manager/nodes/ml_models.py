from keras.models import load_model
from keras.utils import to_categorical
from ml_flow_manager.core import ProcessingNode
import numpy as np


class Model(ProcessingNode):
    def __init__(self):
        super(Model, self).__init__()


class ModelLoader(Model):
    def __init__(self):
        super(ModelLoader, self).__init__()
        self._available_params = ['model_path', 'loss', 'metrics', 'optimizer', 'compile', 'train',
                                  'validate', 'epochs', 'batch_size']
        self._params['optimizer'] = None
        self._params['compile'] = False
        self._params['train'] = False
        self._params['validate'] = False

    def run(self):
        model_path = self._params['model_path']

        model = load_model(model_path)
        if self._params['compile']:
            loss = self._params['loss']
            metrics = self._params['metrics']
            optimizer = self._params['optimizer']

            model.compile(loss=loss, optimizer=optimizer, metrics=metrics)

        if self._params['train']:
            x_train = self._inputs[0]
            y_train = self._inputs[1]

            epochs = self._params['epochs']
            batch_size = self._params['batch_size']

            if self._params['validate']:
                x_test = self._inputs[2]
                y_test = self._inputs[3]

                model.fit(x=x_train, y=to_categorical(y_train), epochs=epochs, batch_size=batch_size)
            else:
                model.fit(x=x_train, y=to_categorical(y_train), epochs=epochs, batch_size=batch_size)
        print(model.summary())

        self._outputs = [model]


class ModelPredictor(Model):
    def __init__(self):
        super(ModelPredictor, self).__init__()
        self._available_params = ['index']
        self._params['index'] = None

    def run(self):
        model = self._inputs[0]
        x_test = self._inputs[1]

        index = self._params['index']
        if index:
            x_test = x_test[index:index + 1]

        pred = model.predict(x_test)
        for p in pred:
            print(np.argmax(p))

        self._outputs = [pred]


class ModelEvaluator(Model):
    def __init__(self):
        super(ModelEvaluator, self).__init__()

    def run(self):
        model = self._inputs[0]
        x_test = self._inputs[1]
        y_test = to_categorical(self._inputs[2])

        eval = model.evaluate(x_test, y_test)
        print(eval)

        self._outputs = [eval]
