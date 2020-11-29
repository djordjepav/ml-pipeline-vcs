from ml_flow_manager.core import ProcessingNode


class DataPreprocessor(ProcessingNode):
    def __init__(self):
        super(DataPreprocessor, self).__init__()


class DataNormalizer(DataPreprocessor):
    def __init__(self):
        super(DataNormalizer, self).__init__()

    def run(self):
        outputs = []
        for data in self._inputs:
            data = data / data.max()
            outputs.append(data)

        self._outputs = outputs


class DataStandardizer(DataPreprocessor):
    def __init__(self):
        super(DataStandardizer, self).__init__()

    def run(self):
        outputs = []
        for data in self._inputs:
            mean = (data.max() - data.min()) / 2
            std = data.max() - mean
            data = data - mean
            data = data / std
            outputs.append(data)

        self._outputs = outputs
