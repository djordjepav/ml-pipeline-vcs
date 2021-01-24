import json
import re


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


class ProcessingNode:
    def __init__(self):
        self._available_params = []
        self._params = {}
        self._input_keys = []
        self._output_keys = []
        self._inputs = []
        self._outputs = []

    def set_param(self, key, param):
        self._params[key] = param

    def inputs(self, data_keys):
        self._input_keys.clear()
        for key in data_keys:
            self._input_keys.append(key)

    def outputs(self, data_keys):
        self._output_keys.clear()
        for key in data_keys:
            self._output_keys.append(key)

    def initialize(self, data_holder):
        for key in self._input_keys:
            data = data_holder.get_data(key)
            self._inputs.append(data)

    def finalize(self, data_holder):
        for data_name, data in zip(self._output_keys, self._outputs):
            if data_name in data_holder.get_keys():
                data_holder.remove(data_name)
            data_holder.add(data_name, data)

    def serialize(self, filename=None):
        json_node = {'available_params': self._available_params,
                     'params': self._params,
                     'input_keys': self._input_keys,
                     'output_keys': self._output_keys
                     }
        return json_node

    def run(self):
        pass


class FlowManager(ProcessingNode):
    def __init__(self, factory, name='my_flow', version='0.0.0'):
        super().__init__()
        self.__data_holder = DataHolder()
        self.__processing_nodes = []
        self.__factory = factory
        self.__name = name
        self.__version = version

    @staticmethod
    def __get_node_name(node):
        words = re.findall('[A-Z][a-z]*', node.__class__.__name__)
        name = ''
        for w in words:
            name += w.lower() + '_'
        return name[:-1]

    def get_data_holder(self):
        return self.__data_holder

    def attach_node(self, node_name):
        node = self.__factory.create_node(node_name)
        self.__processing_nodes.append(node)
        return node

    def get_info(self):
        return self.__name, self.__version

    def serialize(self, filename=None):
        json_flow = {
            'flow_name': self.__name,
            'flow_version': self.__version,
            'nodes': []
            }
        for node in self.__processing_nodes:
            json_node = node.serialize()
            json_node['type'] = self.__get_node_name(node)

            json_flow['nodes'].append(json_node)

        with open(filename, 'w') as f:
            json.dump(json_flow, f, indent=4)

    def deserialize(self, filename):
        with open(filename, 'r') as f:
            json_data = json.load(f)

            self.__name = json_data['flow_name']
            self.__version = json_data['flow_version']

            for json_node in json_data['nodes']:
                node = self.attach_node(json_node['type'])
                for key in json_node['params']:
                    node.set_param(key, json_node['params'][key])
                node.inputs(json_node['input_keys'])
                node.outputs(json_node['output_keys'])

    def run(self):
        self.__data_holder.clear_all()
        for node in self.__processing_nodes:
            node.initialize(self.__data_holder)
            node.run()
            node.finalize(self.__data_holder)
