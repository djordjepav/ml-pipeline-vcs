import React, { forwardRef, useRef, useEffect,useState,useImperativeHandle } from 'react';
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

export default function FlowVersionCreate({flowname,flowid,prev}){

    const [cookies] = useCookies(['user']);

    const [commponents,setCommponents] = useState([]);
    const [save,setSave] = useState(false);
    const [noOfNodes,setNoOfNodes] = useState(0);

    const [nodes,setNodes] = useState(
        [
            // {
            //     "available_params": [
            //         "dataset"
            //     ],
            //     "input_keys": [],
            //     "output_keys": [
            //         "x_train",
            //         "x_test",
            //         "y_train",
            //         "y_test"
            //     ],
            //     "params": {
            //         "dataset": "mnist"
            //     },
            //     "type": "keras_dataset_loader"
            // },
            // {
            //     "available_params": [
            //         "dataset"
            //     ],
            //     "input_keys": [],
            //     "output_keys": [
            //         "x_train",
            //         "x_test",
            //         "y_train",
            //         "y_test"
            //     ],
            //     "params": {
            //         "dataset": "mnist2"
            //     },
            //     "type": "keras_dataset_loader"
            // }
        ])

    const [flow,setFlow] = useState(
    {
        "created_by": cookies.id,
        "flow" : flowid,
        "prev_flow_version": prev,
        "serialized_flow": {
            "flow_name": flowname,
            "flow_version": "0.1.1",
            "nodes": nodes
    }})


    useEffect(() => {
        
    },[] );



    const handleClick = () => {
        console.log(nodes);

        let item = flow;
        item.serialized_flow.nodes = nodes;
        
        setFlow(item);

        // let item = {...items[props.id]};

        console.log(flow);
        console.log(Object.keys(flow.serialized_flow.nodes[0]).length); 
    }

    const addNode = () =>
    {
        setCommponents([...commponents,<DataNormalizer nodes={nodes} setNodes={setNodes} id={noOfNodes} creationFlag={true}></DataNormalizer>])
        setNoOfNodes(1+noOfNodes);
    } 
             

    return(
        <div className="flowCreate">
            <div className="nodeSelection">
                <p id="naslov">Create flow version for: {flowname}</p>
                <p>Add commponent:</p>
                <ul>
                    <p className="link" onClick={() => addNode()}>- DataNormalizer</p>
                    <p className="link">- DataPlotter</p>
                    <p className="link">- DatasetLoader</p>
                    <p className="link">- DataStandardizer</p>
                    <p className="link">- ModelEvaluator</p>
                    <p className="link">- ModelLoader</p>
                    <p className="link">- ModlerPredictor</p>
                </ul>
                <button onClick={() => handleClick()}>Save</button>
            </div>
            <div className="flowReview">
                {commponents?.map(commponent =>
                    (
                        commponent
                    ))}
            </div>
           
        </div>
    )
    
}
