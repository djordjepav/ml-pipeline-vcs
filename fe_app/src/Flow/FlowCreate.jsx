import React, { useEffect,useState,useReducer } from 'react';
import './Flow.css';
import { useCookies } from 'react-cookie';

import { useParams } from 'react-router-dom';
import DatasetLoader from '../Nodes/DatasetLoader';
import ModelLoader from '../Nodes/ModelLoader';
import DataNormalizer from '../Nodes/DataNormalizer';
import DataPlotter from '../Nodes/DataPlotter';
import ModelEvaluator from '../Nodes/ModelEvaluator';
import DataStandardizer from '../Nodes/DataStandardizer';
import ModelPredictor from '../Nodes/ModelPredictor';

import { useToasts } from 'react-toast-notifications';
import {useHistory} from "react-router-dom";
import io from "socket.io-client";


export default function FlowCreate(){

    const [cookies] = useCookies(['user']);
    const {teamid} = useParams();

    const [flowname, setFlowName] = useState("");
    const [initialVersion, setInitialVersion] = useState("");

    const [nodes, setNodes] = useState([]);
    const [isMount, setIsMount] = useState(1);
    const [save, setSave] = useState(false);

    const { addToast } = useToasts();
    const history = useHistory();
    const [socket, setSocket] = useState(null);

    //const [nodeComponents, setNodeComponents] = useState();
    //const [nodesCount, setNodesCount] = useState(0);

    const [flow, setFlow] = useState({
        "created_by": cookies.id,
        "team" : teamid,
        serialized_flow: {
            flow_name: flowname,
            flow_version: initialVersion,
            nodes: nodes,
        }
    });

        
    useEffect(() => {
        if(isMount){
            const socket = io("http://localhost:8080");
            setSocket(socket);
            setIsMount(0);
        }
        else {
            if(save==true){
                createFlowVersion();
                console.log(flow);
                setSave(false);
            }
        }
    },[flow] );

    // useEffect(() => {
    //     console.log(nodes)
    // },[nodes] );


    const createFlowVersion = async() => {

        const requestOptions = {
            method: 'POST',
            headers:{
                'Authorization': 'Token ' + cookies.token,
                'Content-Type': 'application/json',
                'accept': 'application/json'
            },
            body: JSON.stringify(flow)
        };

        const response = await fetch("http://localhost:8000/easy_flow/v1/flow_create/",requestOptions);
        const data = await response.json();
        console.log(data);

        if(response.ok) {
            addToast("Flow created", {
                appearance: 'success',
                autoDismiss: true,
            });

            socket.emit('add_team', data);

            history.push("/flow/"+ data.team + "/" + data.id + "/" + data.name + "/" + data.root.id);
        }

    }

    const handleSave = () => {
        setFlow({...flow, serialized_flow: {...flow.serialized_flow,flow_name: flowname, flow_version: initialVersion, nodes: nodes}});
        setSave(true);
    }

    const addNode = (type) => {

        var node = {
            "available_params": null,
            "input_keys": [],
            "output_keys": [],
            "params": {},
            "type": type
        }
        setNodes(nodes => [...nodes, node]);
    }
             
    return(
        <div className="flowCreate">
            <div className="nodeSelection">
                Flow name: <input className="inputNode" type="text" value={flowname} onChange={(e) => setFlowName(e.target.value)}/>
                <br/>
                Initial version: <input className="inputNode" type="text" value={initialVersion} onChange={(e) => setInitialVersion(e.target.value)}/>
                <p id="naslov">Create initial version for: {flowname}</p>
                <p>Add commponent:</p>
                <ul>
                    <p className="link" onClick={() => addNode("data_normalizer")}>- DataNormalizer</p>
                    <p className="link" onClick={() => addNode("data_plotter")}>- DataPlotter</p>
                    <p className="link" onClick={() => addNode("keras_dataset_loader")}>- DatasetLoader</p>
                    <p className="link" onClick={() => addNode("data_standardizer")}>- DataStandardizer</p>
                    <p className="link" onClick={() => addNode("model_evaluator")}>- ModelEvaluator</p>
                    <p className="link" onClick={() => addNode("model_loader")}>- ModelLoader</p>
                    <p className="link" onClick={() => addNode("model_predictor")}>- ModlerPredictor</p>
                </ul>
                <button onClick={() => handleSave()}>Save</button>
            </div>
            <div className="flowReview">

                {nodes?.map((node, index) => (
                    <div key={index}>
                        {node.type == "data_normalizer" &&
                        <DataNormalizer nodes={nodes} setNodes={setNodes} creationFlag={true} id={index}/>}

                        {node.type == "data_plotter" &&
                        <DataPlotter nodes={nodes} setNodes={setNodes} creationFlag={true} id={index}/>}
                        
                        {node.type == "keras_dataset_loader" && 
                        <DatasetLoader nodes={nodes} setNodes={setNodes} creationFlag={true} id={index}/>}    

                        {node.type == "data_standardizer" &&
                        <DataStandardizer nodes={nodes} setNodes={setNodes} creationFlag={true} id={index}/>}
                        
                        {node.type == "model_evaluator" &&
                        <ModelEvaluator nodes={nodes} setNodes={setNodes} creationFlag={true} id={index}/>}

                        {node.type == "model_loader" &&  
                        <ModelLoader teamid={teamid} nodes={nodes} setNodes={setNodes} creationFlag={true} id={index}/>}
                        
                        {node.type == "model_predictor" &&
                        <ModelPredictor nodes={nodes} setNodes={setNodes} creationFlag={true} id={index}/>}
                    </div>
                ))}
            </div>
        </div>
    )
    
}
