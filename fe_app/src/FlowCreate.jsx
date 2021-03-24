import React, { useEffect,useState } from 'react';
import './Flow.css';
import { useCookies } from 'react-cookie';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { useParams } from 'react-router-dom';
import DatasetLoader from './Nodes/DatasetLoader';
import ModelLoader from './Nodes/ModelLoader';
import DataNormalizer from './Nodes/DataNormalizer';
import DataPlotter from './Nodes/DataPlotter';
import ModelEvaluator from './Nodes/ModelEvaluator';
import DataStandardizer from './Nodes/DataStandardizer';
import ModelPredictor from './Nodes/ModelPredictor';

export default function FlowCreate({flowname},{flowid}){

    const [cookies] = useCookies(['user']);

    const file = JSON.stringify({
        "created_by": cookies.id,
        "flow" : flowid,
        "prev_flow_version": 7,
        "serialized_flow": {
            "flow_name": {flowname},
            "flow_version": "0.1.1",
            "nodes": [
                {
                    "available_params": [
                        "dataset"
                    ],
                    "input_keys": [],
                    "output_keys": [
                        "x_train",
                        "x_test",
                        "y_train",
                        "y_test"
                    ],
                    "params": {
                        "dataset": "mnist"
                    },
                    "type": "keras_dataset_loader"
                }]}});

    useEffect(() => {
        console.log(file);
    },[] );
             

    return(
        <div className="flowCreate">
            <div className="nodeSelection">
                <p id="naslov">Create flow version for: {flowname}</p>
                <p>Add commponent:</p>
                <ul>
                    <p className="link">- DataNormalizer</p>
                    <p className="link">- DataPlotter</p>
                    <p className="link">- DatasetLoader</p>
                    <p className="link">- DataStandardizer</p>
                    <p className="link">- ModelEvaluator</p>
                    <p className="link">- ModelLoader</p>
                    <p className="link">- ModlerPredictor</p>
                </ul>
            </div>
            <div className="flowReview">
                ALO ALO
            </div>
        </div>
    )
    
}
