from ml_flow_manager.core import ProcessingNode
from keras import datasets


class DataLoader(ProcessingNode):
    def __init__(self):
        super(DataLoader, self).__init__()
        self._available_params = ['src']


class KerasDatasetLoader(DataLoader):
    def __init__(self):
        super(KerasDatasetLoader, self).__init__()
        self._available_params = ['dataset']

    def run(self):
        dataset = self._params['dataset']
        x_test, y_test, x_train, y_train = None, None, None, None
        if dataset == 'mnist':
            (x_train, y_train), (x_test, y_test) = datasets.mnist.load_data()
        elif dataset == 'cifar10':
            (x_train, y_train), (x_test, y_test) = datasets.cifar10.load_data()
        elif dataset == 'cifar100':
            (x_train, y_train), (x_test, y_test) = datasets.cifar100.load_data()
        elif dataset == 'imdb':
            (x_train, y_train), (x_test, y_test) = datasets.imdb.load_data()
        elif dataset == 'reuters':
            (x_train, y_train), (x_test, y_test) = datasets.reuters.load_data()
        elif dataset == 'fashion_mnist':
            (x_train, y_train), (x_test, y_test) = datasets.fashion_mnist.load_data()
        elif dataset == 'boston_housing':
            (x_train, y_train), (x_test, y_test) = datasets.boston_housing.load_data()

        self._outputs = [x_train, y_train, x_test, y_test]
