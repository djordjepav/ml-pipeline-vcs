from ml_flow_manager.core import FlowManager
from ml_flow_manager.factory import LocalFactory

MODEL_PATH = '/home/djordjepav/Data/Fax/Semestar 7/Arhitektura i Projektovanje Softvera/Project/data/mnist.h5'


def create_flow(mode):
    factory = LocalFactory()
    flow_manager = FlowManager(factory=factory, name='mnist_flow', version='3.0.0')

    if mode == 'create_locally':
        minst_dataset_loader = flow_manager.attach_node('keras_dataset_loader')
        minst_dataset_loader.set_param('dataset', 'mnist')
        minst_dataset_loader.outputs(['x_train', 'y_train', 'x_test', 'y_test'])

        data_normalizer = flow_manager.attach_node('data_normalizer')
        data_normalizer.inputs(['x_train', 'x_test'])
        data_normalizer.outputs(['x_train', 'x_test'])

        model_loader = flow_manager.attach_node('model_loader')
        model_loader.set_param('model_path', MODEL_PATH)
        model_loader.set_param('train', True)
        model_loader.set_param('epochs', 10)
        model_loader.set_param('batch_size', 128)
        model_loader.set_param('publish', 2)
        model_loader.inputs(['x_train', 'y_train'])
        model_loader.outputs(['model'])

        model_eval = flow_manager.attach_node('model_evaluator')
        model_eval.inputs(['model', 'x_test', 'y_test'])
        model_eval.outputs(['eval'])

        model_pred = flow_manager.attach_node('model_predictor')
        model_pred.set_param('index', 10)
        model_pred.inputs(['model', 'x_test'])
        model_pred.outputs(['pred'])

        flow_manager.run()
        flow_manager.serialize('_'.join(flow_manager.get_info()) + '.json')
    else:
        flow_manager.deserialize('mnist.json')
        flow_manager.run()


if __name__ == '__main__':
    create_flow('create_locally')
