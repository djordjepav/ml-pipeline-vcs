import React, { useEffect,useState } from 'react';
import "../Flow.css";

export default function ModelLoader(props){

    const [details,setDetails] = useState(0);
    const [update,setUpdate] = useState(0);

    const [path, setPath] = useState();
    const [loss,setLoss] = useState();
    const [metrics,setMetrics] = useState();
    const [optimizer,setOprimizer] = useState();
    const [compile,setCompile] = useState();
    const [train,setTrain] = useState();
    const [epochs,setEpochs] = useState();
    const [batchSize,setBatchSize] = useState();
    const [publish,setPublish] = useState();

    const [input,setInput] = useState([]);
    const [output,setOutput] = useState([]);


    useEffect(() => {
        setPath(props.node.params["model_path"]);
        setLoss(props.node.params["loss"]);
        setMetrics(props.node.params["metrics"]);
        setOprimizer(props.node.params["optimizer"]);
        setCompile(props.node.params["compile"]?1:0);
        setTrain(props.node.params["train"]?1:0);
        setEpochs(props.node.params["epochs"]);
        setBatchSize(props.node.params["batch_size"]);
        setPublish(props.node.params["publish"]?1:0);

        setInput(props.node.input_keys);
        setOutput(props.node.output_keys);

        //console.log(data);
    },[props.node] );


    const onChange = () =>
    {
        setUpdate(!update);
        if(update)
        {
            //console.log("upisujem")
            
            props.node.params["model_path"] = path;
            props.node.params["loss"] = loss;
            props.node.params["metrics"] = metrics;
            props.node.params["optimizer"] = optimizer;
            props.node.params["compile"] = compile;
            props.node.params["train"] = train;
            props.node.params["epochs"] = epochs;
            props.node.params["batch_size"] = batchSize;
            props.node.params["publish"] = publish;

            props.node.input_keys = input;
            props.node.output_keys = output;

            props.setNodes(1);
            //props.update()
        }
    }

    const addInput = () =>
    {
        setInput(input => [...input,"null"]);
    }

    const removeInput = (index) =>
    {
        var temp = [...input];
        temp.splice(index,1);
        setInput(temp);
    }

    const changeInput = (index,e) =>
    {
        var temp = [...input];
        temp[index] = e.target.value;
        setInput(temp);
    }

    const addOutput = () =>
    {
        setOutput(output => [...output,"null"]);
    }

    const removeOutput = (index) =>
    {
        var temp = [...output];
        temp.splice(index,1);
        setOutput(temp);
    }

    const changeOutput = (index,e) =>
    {
        var temp = [...output];
        temp[index] = e.target.value;
        setOutput(temp);
    }

    return(
        <div className="node">
            {details == 0 && <br/>}
            <span onClick={() => setDetails(!details)}><b>ModelLoader</b></span>
            {details == 1 &&
            <div>
                <hr></hr>
                {update == 1  ?
                <>
                    <table className="NodeTable">
                        <tr>
                            <th> 
                                Input keys:
                                <button onClick={() => addInput()}>+</button>
                            </th>
                            
                        </tr>
                        {input.length == 0 ? 
                            <tr>
                                <td>
                                    null
                                </td>
                            </tr>
                        :
                        <>
                        {input.map((item, index) => (
                            <tr>
                                <td>
                                    <input className="inputNode" type="text" value={item} onChange={(e) => changeInput(index,e)}/>
                                    <button onClick={() => removeInput(index)}>-</button>
                                </td>
                            </tr>
                        ))}
                        </>}
                    </table>
                    <table className="NodeTable">
                        <tr>
                            <th>  
                                Output keys: 
                                <button onClick={() => addOutput()}>+</button>
                            </th>
                        </tr>
                        {output.length == 0 ? 
                            <tr>
                                <td>
                                    null
                                </td>
                            </tr>
                        :
                        <>
                        {output.map((item, index) => (
                            <tr>
                                <td>
                                    <input className="inputNode" type="text" value={item} onChange={(e) => changeOutput(index,e)}/>
                                    <button onClick={() => removeOutput(index)}>-</button>
                                </td>
                            </tr>
                        ))}
                        </>}
                    </table>
                    <br/>
                    <table className="NodeTable">
                        <tr>
                            <th> Model path: </th>
                            <td>
                                <input className="inputNode" type="text" value={path} onChange={(e) => setPath(e.target.value)} />
                            </td>
                        </tr>
                        <tr>
                            <th> Loss: </th>
                            <td>
                                <input className="inputNode" type="text" value={loss} onChange={(e) => setLoss(e.target.value)} />
                            </td>
                        </tr>
                        <tr>
                            <th> Metrics: </th>
                            <td>
                                <input className="inputNode" type="text" value={metrics} onChange={(e) => setMetrics(e.target.value)} />
                            </td>
                        </tr>
                        <tr>
                            <th> Optimizer: </th>
                            <td>
                                <input className="inputNode" type="text" value={optimizer} onChange={(e) => setOprimizer(e.target.value)} />
                            </td>
                        </tr>
                        <tr>
                            <th> Compile: </th>
                            <td>
                                <input type="checkbox" value={compile} checked={compile} onChange={() => setCompile(!compile)} />
                            </td>
                        </tr>
                        <tr>
                            <th> Train: </th>
                            <td>
                                <input type="checkbox" value={train} checked={train} onChange={() => setTrain(!train)} />
                            </td>
                        </tr>
                        <tr>
                            <th> Epochs: </th>
                            <td>
                                <input className="inputNode" type="number" value={epochs} onChange={(e) => setEpochs(e.target.value)} />
                            </td>
                        </tr>
                        <tr>
                            <th> Batch size: </th>
                            <td>
                                <input className="inputNode" type="number" value={batchSize} onChange={(e) => setBatchSize(e.target.value)} />
                            </td>
                        </tr>
                        <tr>
                            <th> Publish: </th>
                            <td>
                                <input type="checkbox" value={publish} checked={publish} onChange={() => setPublish(!publish)} />
                            </td>
                        </tr>
                    </table>
                </>
                :
                <>
                    <table className="NodeTable">
                        <tr>
                            <th> 
                                Input keys:
                            </th>
                            
                        </tr>
                        {input.length == 0 ? 
                            <tr>
                                <td>
                                    null
                                </td>
                            </tr>
                        :
                        <>
                        {input.map((item, index) => (
                            <tr>
                                <td>
                                    {item}
                                </td>
                            </tr>
                        ))}
                        </>}
                    </table>
                    <table className="NodeTable">
                        <tr>
                            <th>  
                                Output keys: 
                            </th>
                        </tr>
                        {output.length == 0 ? 
                            <tr>
                                <td>
                                    null
                                </td>
                            </tr>
                        :
                        <>
                        {output.map((item, index) => (
                            <tr>
                                <td>
                                    {item}
                                </td>
                            </tr>
                        ))}

                    </>}
                    </table>
                    <br/>
                    <table className="NodeTable">
                            <tr>
                                <th> Model path: </th>
                                <td> <p id="bilosta">{path?path:'null'}</p> </td>
                            </tr>
                            <tr>
                                <th> Loss: </th>
                                <td> {loss?loss:'null'} </td>
                            </tr>
                            <tr>
                                <th> Metrics: </th>
                                <td> {metrics?metrics:'null'} </td>
                            </tr>
                            <tr>
                                <th> Optimizer: </th>
                                <td> {optimizer?optimizer:'null'} </td>
                            </tr>
                            <tr>
                                <th> Compile: </th>
                                <td> {compile?'true':'false'} </td>
                            </tr>
                            <tr>
                                <th> Train: </th>
                                <td> {train?'true':'false'} </td>
                            </tr>
                            <tr>
                                <th> Epochs: </th>
                                <td> {epochs?epochs:'null'} </td>
                            </tr>
                            <tr>
                                <th> Batch size: </th>
                                <td> {batchSize?batchSize:'null'} </td>
                            </tr>
                            <tr>
                                <th> Publish: </th>
                                <td> {publish?'true':'false'} </td>
                            </tr>
                        </table>
                    </>    
                    }
                    <br/>
                    <button onClick={() => onChange()}>{update == 1 ? 'Submit' : 'Update'}</button>
                </div>
            }
        </div>
    )
}