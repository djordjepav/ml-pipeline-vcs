import React, { useEffect,useState } from 'react';
import './Flow.css';
import { useCookies } from 'react-cookie';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

import DatasetLoader from '../Nodes/DatasetLoader';
import ModelLoader from '../Nodes/ModelLoader';
import DataNormalizer from '../Nodes/DataNormalizer';
import DataPlotter from '../Nodes/DataPlotter';
import ModelEvaluator from '../Nodes/ModelEvaluator';
import DataStandardizer from '../Nodes/DataStandardizer';
import ModelPredictor from '../Nodes/ModelPredictor';
import ExeWindow from './ExeWindow';


export default function Flow(){

    const {teamid} = useParams();
    const {rootid} = useParams();
    const {flowname} = useParams();
    
    const [flowJson,setFlowJson] = useState([]);
    const [flowTree, setFlowTree] = useState([]);
    const [cookies] = useCookies(['user']);
    const [current,setCurrent] = useState("");
    const [updateFlag,setUpdateFlag] = useState(false);
    
    const [nodes,setNodes] = useState([]);



    useEffect(() => {
        getFlowTree();
    },[rootid] );

    useEffect(() => {
        setFlowJson({...flowJson, nodes: nodes});
        updateFlowVersion();
    },[updateFlag]);


    const getFlowTree = async () => {
        const requestOptions = {
            method: 'GET',
            headers:{
                'Authorization': 'Token ' + cookies.token,
                'Content-Type': 'application/json',
                'accept': 'application/json'
            }
            };
        const response = await fetch("http://localhost:8000/easy_flow/v1/flow_version/" + rootid + "/", requestOptions);
        const data = await response.json();
        
        setFlowTree(data);
        setCurrent(rootid);
    }

    const getFlowJson = async(versionid) => {
        const requestOptions = {
            method: 'GET',
            headers:{
                'Authorization': 'Token ' + cookies.token,
                'Content-Type': 'application/json',
                'accept': 'application/json'
            }
            };
        const response = await fetch("http://localhost:8000/easy_flow/v1/flow_version_json/" + versionid + "/", requestOptions);
        const data = await response.json();

        setFlowJson(data);
        setCurrent(versionid);
        setNodes(data.nodes);
        console.log(data.nodes);
    }

    const updateFlowVersion = async() => {

        if(updateFlag)
        {
            setUpdateFlag(0);

            var flow = {
                "created_by": cookies.id,
                "flow_version" : current,
                "serialized_flow": flowJson
            }
            
            console.log(flow);

            const requestOptions = {    
                method: 'PUT',
                headers:{
                    'Authorization': 'Token ' + cookies.token,
                    'Content-Type': 'application/json',
                    'accept': 'application/json'
                },
                body: JSON.stringify(flow)
            };
    
            const response = await fetch("http://localhost:8000/easy_flow/v1/flow_version_edit/",requestOptions);
            const data = await response.json();

            console.log(data);

        }
    }

    const renderTree = (nodes) => (
        <TreeItem key={nodes.id} nodeId={nodes.id} label={flowname + nodes.version} onClick={() => getFlowJson(nodes.id)}>
          {Array.isArray(nodes.children) ? nodes.children.map((node) => renderTree(node)) : null}
        </TreeItem>
    );
          
    return(
      <div className="content" id="flow">
        <div >
            <TreeView
                defaultCollapseIcon={<ExpandMoreIcon />}
                defaultExpanded={['root']}
                defaultExpandIcon={<ChevronRightIcon />}
            >
                {renderTree(flowTree)}
            </TreeView>

            <Link to={`/flow/${teamid}/${flowname}/${rootid}/${current}/create`}>
                <p className="link" >+ Flow version</p>
            </Link>
            
        </div>
        <div>
            {nodes?.map((node, index) => (
                <p>
                    {node.type == "data_normalizer" &&
                    <DataNormalizer nodes={nodes} setNodes={setNodes} setUpdateFlag={setUpdateFlag} creationFlag={false} id={index}/>}

                    {node.type == "data_plotter" &&
                    <DataPlotter nodes={nodes} setNodes={setNodes} setUpdateFlag={setUpdateFlag} creationFlag={false} id={index}/>}
                    
                    {node.type == "keras_dataset_loader" && 
                    <DatasetLoader nodes={nodes} setNodes={setNodes} setUpdateFlag={setUpdateFlag} creationFlag={false} id={index}/>}    

                    {node.type == "data_standardizer" &&
                    <DataStandardizer nodes={nodes} setNodes={setNodes} setUpdateFlag={setUpdateFlag} creationFlag={false} id={index}/>}
                    
                    {node.type == "model_evaluator" &&
                    <ModelEvaluator nodes={nodes} setNodes={setNodes} setUpdateFlag={setUpdateFlag} creationFlag={false} id={index}/>}

                    {node.type == "model_loader" &&  
                    <ModelLoader  nodes={nodes} setNodes={setNodes} setUpdateFlag={setUpdateFlag} creationFlag={false} id={index}/>}
                    
                    {node.type == "model_predictor" &&
                    <ModelPredictor nodes={flowJson.nodes} setNodes={setNodes} setUpdateFlag={setUpdateFlag} creationFlag={false} id={index}/>}

                </p>
            ))}
        </div>
        <div>
            <ExeWindow></ExeWindow>
        </div>
      </div>
    )
}