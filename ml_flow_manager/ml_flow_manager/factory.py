from ml_flow_manager.nodes import data_loader, data_preprocessor, visualizer, ml_models


class FlowFactory:
    def __init__(self, nodes):
        self.__nodes = nodes

    def create_node(self, node_name):
        pass


class LocalFactory(FlowFactory):
    def __init__(self):
        self.__nodes = [
            'keras_dataset_loader',
            'data_plotter',
            'data_normalizer',
            'data_standardizer',
            'model_loader',
            'model_evaluator'
            ]
        super(LocalFactory, self).__init__(self.__nodes)

    def create_node(self, node_name):
        if node_name == 'keras_dataset_loader':
            return data_loader.KerasDatasetLoader()
        elif node_name == 'data_plotter':
            return visualizer.DataPlotter()
        elif node_name == 'data_normalizer':
            return data_preprocessor.DataNormalizer()
        elif node_name == 'data_standardizer':
            return data_preprocessor.DataStandardizer()
        elif node_name == 'model_loader':
            return ml_models.ModelLoader()
        elif node_name == 'model_predictor':
            return ml_models.ModelPredictor()
        elif node_name == 'model_evaluator':
            return ml_models.ModelEvaluator()
