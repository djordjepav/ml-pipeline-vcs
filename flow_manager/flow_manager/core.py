class DataHolder:
    def __init__(self):
        self.__data = {}

    def add(self, key, data):
        self.__data[key] = data

    def remove(self, key):
        del self.__data[key]

    def clear_all(self):
        self.__data.clear()

    def get_keys(self):
        return self.__data.keys()

    def get_data(self, key):
        return self.__data[key]


class ProcessingNode():
    def __init__(self):
        self.__params = {}
        self.__input_keys = []
        self.__output_keys = []
        self.__inputs = []
        self.__outputs = []

    def set_params(self, params):
        self.__params = params

    def inputs(self, data_keys):
        self.__input_keys.clear()
        for key in data_keys:
            self.__input_keys.append(key)

    def outputs(self, data_keys):
        self.__output_keys.clear()
        for key in data_keys:
            self.__output_keys.append(key)

    def __initialize(self, data_holder):
        for key in self.__input_keys:
            data = data_holder.get_data(key)
            self.__inputs.append(data)

    def __finalize(self, data_holder):
        for data_name, data in zip(self.__output_keys, self.__outputs):
            data_holder.add(data_name, data)

    def run(self, pipe_data):
        self.__initialize()

        # execution code

        self.__finalize()


class FlowManager(self.ProcessingUnit):
    def __init__(self, factory=None):
        self.__data_holder = DataHolder()
        self.__processing_units = []
        self.__factory = factory

    def attach_node(self, node_name):
        self.__factory.create_node(node_name)

    def run(self):
        self.__data_holder.clear_all()
        for operator in self.__operators:
            operator.run(self.__pipe_data)
