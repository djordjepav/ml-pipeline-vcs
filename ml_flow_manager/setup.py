import os

from setuptools import find_packages, setup

NAME = 'ml-flow-manager'
DESCRIPTION = 'Machine Learning Flow Manager Framework.'
REQUIRES_PYTHON = '>=3.6.0'
REQUIRED = [
    'numpy~=1.18.5',
    'pandas~=1.1.1',
    'matplotlib~=3.3.1',
    'tensorflow~=2.3.0',
    'Keras~=2.4.3',
    'pyqt5~=5.15.2',
    'Redis'
    ]
VERSION = '0.0.1'

here = os.path.abspath(os.path.dirname(__file__))
try:
    with open(os.path.join(here, 'README.md'), encoding='utf-8') as f:
        long_description = f.read()
except FileNotFoundError:
    long_description = DESCRIPTION

setup(
        name=NAME,
        version=VERSION,
        description=DESCRIPTION,
        long_description=long_description,
        long_description_content_type='text/markdown',
        python_requires=REQUIRES_PYTHON,
        packages=find_packages(),
        package_dir={'': '.'},
        entry_points={
            'console_scripts': [
                'run-flow = scripts.run_flow:run'
                ]
            }
        )
