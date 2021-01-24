import argparse

from ml_flow_manager.core import FlowManager
from ml_flow_manager.factory import LocalFactory


def run():
    parser = argparse.ArgumentParser(description='Flow Runner')
    parser.add_argument(dest='name', type=str, default='mnist.json',
                        help='<required> name of json file with serialized flow')

    args = parser.parse_args()
    name = args.name

    factory = LocalFactory()
    flow_manager = FlowManager(factory=factory)
    flow_manager.deserialize(name)

    flow_manager.run()


if __name__ == '__main__':
    run()
