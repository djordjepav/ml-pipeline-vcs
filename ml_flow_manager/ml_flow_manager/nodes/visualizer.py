import matplotlib.pyplot as plt
from ml_flow_manager.core import ProcessingNode


class Visualizer(ProcessingNode):
    def __init__(self):
        super(Visualizer, self).__init__()


class DataPlotter(Visualizer):
    def __init__(self):
        super(DataPlotter, self).__init__()
        self._available_params = ['index']

    def run(self):
        index = self._params['index']
        data = self._inputs[0][index]

        plt.imshow(data)
        plt.show()
