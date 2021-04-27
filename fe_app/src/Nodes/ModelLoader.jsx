import React, { useEffect, useState } from 'react';
import "../Flow/Flow.css";

export default function ModelLoader(props) {

    const [details, setDetails] = useState(0);
    const [update, setUpdate] = useState(0);

    const [path, setPath] = useState();
    const [loss, setLoss] = useState();
    const [metrics, setMetrics] = useState();
    const [optimizer, setOprimizer] = useState();
    const [compile, setCompile] = useState();
    const [train, setTrain] = useState();
    const [epochs, setEpochs] = useState();
    const [batchSize, setBatchSize] = useState();
    const [publish, setPublish] = useState();

    const [input, setInput] = useState([]);
    const [output, setOutput] = useState([]);



    useEffect(() => {
        if (props.creationFlag == true) {
            setUpdate(true);

            //mesto za dodavanje parametara

            let nodes = [...props.nodes];

            nodes[props.id].available_params = ["path","loss","metrics","optimizer","compile","train","epochs","batchSize","publish"];
            nodes[props.id].params = {
                "path": null,
                "loss": null,
                "metrics": null,
                "optimizer": null,
                "compile": null,
                "train": null,
                "epochs": null,
                "batchSize": null,
                "publish": null
            }


            props.setNodes(nodes);
        }

    }, []);


    useEffect(() => {
        if (props.creationFlag == false) {
            setPath(props.nodes[props.id].params["model_path"]);
            setLoss(props.nodes[props.id].params["loss"]);
            setMetrics(props.nodes[props.id].params["metrics"]);
            setOprimizer(props.nodes[props.id].params["optimizer"]);
            setCompile(props.nodes[props.id].params["compile"] ? 1 : 0);
            setTrain(props.nodes[props.id].params["train"] ? 1 : 0);
            setEpochs(props.nodes[props.id].params["epochs"]);
            setBatchSize(props.nodes[props.id].params["batch_size"]);
            setPublish(props.nodes[props.id].params["publish"] ? 1 : 0);

            setInput(props.nodes[props.id].input_keys);
            setOutput(props.nodes[props.id].output_keys);
        }

        //console.log(data);
    }, [props.node]);




    const onChange = () => {

        setUpdate(!update);

        if (update) {

            let nodes = [...props.nodes];

            nodes[props.id].input_keys = input;
            nodes[props.id].input_keys = output;

            nodes[props.id].params["model_path"] = path;
            nodes[props.id].params["loss"] = loss;
            nodes[props.id].params["metrics"] = metrics;
            nodes[props.id].params["optimizer"] = optimizer;
            nodes[props.id].params["compile"] = compile;
            nodes[props.id].params["train"] = train;
            nodes[props.id].params["epochs"] = epochs;
            nodes[props.id].params["batch_size"] = batchSize;
            nodes[props.id].params["publish"] = publish;

            props.setNodes(nodes);
            props.setUpdateFlag(1);
        }
    }

    const addInput = () => {

        let temp = [...input];
        temp.push("null");
        setInput(temp);

        if (props.creationFlag) {

            let nodes = [...props.nodes];
            nodes[props.id].input_keys = temp;
            props.setNodes(nodes);
        }

    }
    const removeInput = (index) => {
        var temp = [...input];
        temp.splice(index, 1);
        setInput(temp);

        if (props.creationFlag) {

            let nodes = [...props.nodes];
            nodes[props.id].input_keys = temp;
            props.setNodes(nodes);
        }
    }

    const changeInput = (index, e) => {
        var temp = [...input];
        temp[index] = e.target.value;
        setInput(temp);


        if (props.creationFlag) {

            let nodes = [...props.nodes];
            nodes[props.id].input_keys = temp;
            props.setNodes(nodes);
        }
    }

    const addOutput = () => {

        let temp = [...output];
        temp.push("null");
        setOutput(temp);

        if (props.creationFlag) {

            let nodes = [...props.nodes];
            nodes[props.id].output_keys = temp;
            props.setNodes(nodes);
        }
    }

    const removeOutput = (index) => {
        var temp = [...output];
        temp.splice(index, 1);
        setOutput(temp);

        if (props.creationFlag) {

            let nodes = [...props.nodes];
            nodes[props.id].output_keys = temp;
            props.setNodes(nodes);
        }
    }

    const changeOutput = (index, e) => {
        var temp = [...output];
        temp[index] = e.target.value;
        setOutput(temp);

        if (props.creationFlag) {

            let nodes = [...props.nodes];
            nodes[props.id].output_keys = temp;
            props.setNodes(nodes);
        }
    }

    const changePath = (e) => {
        setPath(e.target.value);

        if(props.creationFlag){
            let nodes = [...props.nodes];
            nodes[props.id].params["model_path"] = e.target.value;
            props.setNodes(nodes);
        }
    }

    
    const changeLoss = (e) => {
        setLoss(e.target.value);

        if(props.creationFlag){
            let nodes = [...props.nodes];
            nodes[props.id].params["loss"] = e.target.value;
            props.setNodes(nodes);
        }
    }

    const changeMetrics = (e) => {
        setMetrics(e.target.value);

        if(props.creationFlag){
            let nodes = [...props.nodes];
            nodes[props.id].params["metrics"] = e.target.value;
            props.setNodes(nodes);
        }
    }

    const changeOptimizer = (e) => {
        setOprimizer(e.target.value);

        if(props.creationFlag){
            let nodes = [...props.nodes];
            nodes[props.id].params["optimizer"] = e.target.value;
            props.setNodes(nodes);
        }
    }

    const changeCompile = () => {

        let newCompile = !compile;
        setCompile(newCompile)

        if(props.creationFlag){
            let nodes = [...props.nodes];
            nodes[props.id].params["compile"] = newCompile;
            props.setNodes(nodes);
        }
    }

    const changeTrain = () => {

        let newTrain = !train;
        setTrain(newTrain)

        if(props.creationFlag){
            let nodes = [...props.nodes];
            nodes[props.id].params["train"] = newTrain;
            props.setNodes(nodes);
        }
    }

    const changeEpochs = (e) => {
        setEpochs(e.target.value)

        if(props.creationFlag){
            let nodes = [...props.nodes];
            nodes[props.id].params["epochs"] = parseInt(e.target.value);
            props.setNodes(nodes);
        }
    }

    const changeBatchSize = (e) => {
        setBatchSize(e.target.value)

        if(props.creationFlag){
            let nodes = [...props.nodes];
            nodes[props.id].params["batchSize"] = parseInt(e.target.value);
            props.setNodes(nodes);
        }
    }

    const changePublish = (e) => {

        let oldPublish = !publish;
        setPublish(oldPublish)

        if(props.creationFlag){
            let nodes = [...props.nodes];
            nodes[props.id].params["publish"] = oldPublish;
            props.setNodes(nodes);
        }
    }

    return (
        <div className="node">
            {details == 0 && <br />}
            <span onClick={() => setDetails(!details)}><b>ModelLoader</b></span>
            {details == 1 &&
                <div>
                    <hr></hr>
                    {update == 1 ?
                        <>
                            <table className="NodeTable">
                                <thead>
                                    <tr>
                                        <th>
                                            Input keys:
                                        <button onClick={() => addInput()}>+</button>
                                        </th>

                                    </tr>
                                </thead>
                                {input.length == 0 ?
                                    <tbody>
                                        <tr>
                                            <td>
                                                null
                                        </td>
                                        </tr>
                                    </tbody>
                                    :
                                    <>
                                        {input.map((item, index) => (
                                            <tbody key={index}>
                                                <tr>
                                                    <td>
                                                        <input className="inputNode" type="text" value={item} onChange={(e) => changeInput(index, e)} />
                                                        <button onClick={() => removeInput(index)}>-</button>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        ))}
                                    </>}
                            </table>
                            <table className="NodeTable">
                                <thead>
                                    <tr>
                                        <th>
                                            Output keys:
                                        <button onClick={() => addOutput()}>+</button>
                                        </th>
                                    </tr>
                                </thead>
                                {output.length == 0 ?
                                    <tbody>
                                        <tr>
                                            <td>
                                                null
                                        </td>
                                        </tr>
                                    </tbody>
                                    :
                                    <>
                                        {output.map((item, index) => (
                                            <tbody key={index}>
                                                <tr>
                                                    <td>
                                                        <input className="inputNode" type="text" value={item} onChange={(e) => changeOutput(index, e)} />
                                                        <button onClick={() => removeOutput(index)}>-</button>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        ))}
                                    </>}
                            </table>
                            <br />
                            <table className="NodeTable">
                                <tr>
                                    <th> Model path: </th>
                                    <td>
                                        <input className="inputNode" type="text" value={path} onChange={(e) => changePath(e)} />
                                    </td>
                                </tr>
                                <tr>
                                    <th> Loss: </th>
                                    <td>
                                        <input className="inputNode" type="text" value={loss} onChange={(e) => changeLoss(e)} />
                                    </td>
                                </tr>
                                <tr>
                                    <th> Metrics: </th>
                                    <td>
                                        <input className="inputNode" type="text" value={metrics} onChange={(e) => changeMetrics(e)} />
                                    </td>
                                </tr>
                                <tr>
                                    <th> Optimizer: </th>
                                    <td>
                                        <input className="inputNode" type="text" value={optimizer} onChange={(e) => changeOptimizer(e)} />
                                    </td>
                                </tr>
                                <tr>
                                    <th> Compile: </th>
                                    <td>
                                        <input type="checkbox" value={compile} checked={compile} onChange={() => changeCompile()} />
                                    </td>
                                </tr>
                                <tr>
                                    <th> Train: </th>
                                    <td>
                                        <input type="checkbox" value={train} checked={train} onChange={() => changeTrain()} />
                                    </td>
                                </tr>
                                <tr>
                                    <th> Epochs: </th>
                                    <td>
                                        <input className="inputNode" type="number" value={epochs} onChange={(e) => changeEpochs(e)} />
                                    </td>
                                </tr>
                                <tr>
                                    <th> Batch size: </th>
                                    <td>
                                        <input className="inputNode" type="number" value={batchSize} onChange={(e) => changeBatchSize(e)} />
                                    </td>
                                </tr>
                                <tr>
                                    <th> Publish: </th>
                                    <td>
                                        <input type="checkbox" value={publish} checked={publish} onChange={() => changePublish()} />
                                    </td>
                                </tr>
                            </table>
                        </>
                        :
                        <>
                            <table className="NodeTable">
                                <thead>
                                    <tr>
                                        <th>
                                            Input keys:
                                    </th>

                                    </tr>
                                </thead>
                                {input?.length == 0 ?
                                    <tbody>
                                        <tr>
                                            <td>
                                                null
                                   </td>
                                        </tr>
                                    </tbody>
                                    :
                                    <>
                                        {input.map((item, index) => (
                                            <tbody key={index}>
                                                <tr>
                                                    <td>
                                                        {item}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        ))}
                                    </>}
                            </table>
                            <table className="NodeTable">
                                <thead>
                                    <tr>
                                        <th>
                                            Output keys:
                                    </th>
                                    </tr>
                                </thead>
                                {output.length == 0 ?
                                    <tbody>
                                        <tr>
                                            <td>
                                                null
                                        </td>
                                        </tr>
                                    </tbody>
                                    :
                                    <>
                                        {output.map((item, index) => (
                                            <tbody key={index}>
                                                <tr>
                                                    <td>
                                                        {item}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        ))}
                                    </>}
                            </table>
                            <br />
                            <table className="NodeTable">
                                <tr>
                                    <th> Model path: </th>
                                    <td> <p id="bilosta">{path ? path : 'null'}</p> </td>
                                </tr>
                                <tr>
                                    <th> Loss: </th>
                                    <td> {loss ? loss : 'null'} </td>
                                </tr>
                                <tr>
                                    <th> Metrics: </th>
                                    <td> {metrics ? metrics : 'null'} </td>
                                </tr>
                                <tr>
                                    <th> Optimizer: </th>
                                    <td> {optimizer ? optimizer : 'null'} </td>
                                </tr>
                                <tr>
                                    <th> Compile: </th>
                                    <td> {compile ? 'true' : 'false'} </td>
                                </tr>
                                <tr>
                                    <th> Train: </th>
                                    <td> {train ? 'true' : 'false'} </td>
                                </tr>
                                <tr>
                                    <th> Epochs: </th>
                                    <td> {epochs ? epochs : 'null'} </td>
                                </tr>
                                <tr>
                                    <th> Batch size: </th>
                                    <td> {batchSize ? batchSize : 'null'} </td>
                                </tr>
                                <tr>
                                    <th> Publish: </th>
                                    <td> {publish ? 'true' : 'false'} </td>
                                </tr>
                            </table>
                        </>
                    }
                    <br />
                    {props.creationFlag == false ?
                        <div>
                            <button onClick={() => onChange()}>{update == 1 ? 'Submit' : 'Update'}</button>
                        </div>
                        :
                        <div>
                        </div>
                    }

                </div>
            }
        </div>
    )
}