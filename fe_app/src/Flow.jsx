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
import FlowCreate from './FlowCreate';
import FlowVersionCreate from './FlowVersionCreate';

export default function Flow(){

    const {rootid} = useParams();
    const {flowname} = useParams();
    const [flowJson,setFlowJson] = useState([]);
    const [flowTree, setFlowTree] = useState([]);
    const [creation, setCreation] = useState(0);
    const [cookies] = useCookies(['user']);
    const [proba,setProba] = useState("proba");
    const [current,setCurrent] = useState("");
    const [update,setUpdate] = useState(false);
    const [nodes,setNodes] = useState(0);

    const [flow,setFlow] = useState(
    {
        "created_by": cookies.id,
        "flow_version" : current,
        "serialized_flow": flowJson
    })



    useEffect(() => {
        getFlowTree();
    },[] );

    useEffect(() => {
        updateFlowVersion();
    },[nodes]);

    const getFlowTree = async () =>
    {
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
        //console.log(data);
        setFlowTree(data);
        setCurrent(rootid);
    }

    const getFlowJson = async(versionid) =>
    {
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
        console.log(data);

        setFlowJson(data);
        setCurrent(versionid);
        setCreation(0);
    }

    const updateFlowVersion = async() =>
    {
        if(nodes)
        {
            //console.log("UPDATE");
            //console.log(flowJson);

            setNodes(0);

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



    const handleCreate = () =>
    {
        setFlowJson([]);
        setCreation(1);
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

            <p className="link" onClick={() => handleCreate()}>+ Flow version</p>
        </div>
        <div>
        
            {flowJson?.nodes?.map((node, index) => (
                <p>
                    {node.type == "data_normalizer" &&
                    <DataNormalizer nodes={flowJson.nodes} setNodes={setNodes} creationFlag={false} id={index}/>}

                    {node.type == "data_plotter" &&
                    <DataPlotter node={node} setNodes={setNodes} creationFlag={false} id={index}></DataPlotter>}
                    
                    {node.type == "keras_dataset_loader" && 
                    <DatasetLoader nodes={flowJson.nodes} setNodes={setNodes} creationFlag={false} id={index}/>}    

                    {node.type == "data_standardizer" &&
                    <DataStandardizer nodes={flowJson.nodes} setNodes={setNodes} creationFlag={false} id={index}/>}
                    
                    {node.type == "model_evaluator" &&
                    <ModelEvaluator nodes={flowJson.nodes} setNodes={setNodes} creationFlag={false} id={index}/>}

                    {node.type == "model_loader" &&  
                    <ModelLoader  node={node} setNodes={setNodes} creationFlag={false} id={index}/>}
                    
                    {node.type == "model_predictor" &&
                    <ModelPredictor node={node} setNodes={setNodes} creationFlag={false} id={index}/>}
                </p>
            ))}
        </div>
        {creation == 1 && 
            <FlowVersionCreate flowname={flowname} flowid={rootid} prev={current}></FlowVersionCreate>
        }
      </div>
    )
}