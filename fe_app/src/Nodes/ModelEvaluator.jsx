import React, { useEffect, useState } from 'react';
import "../Flow/Flow.css";

export default function ModelEvaluator(props) {

    const [update, setUpdate] = useState(0);
    const [details, setDetails] = useState(0);

    const [index, setIndex] = useState();

    const [input, setInput] = useState([]);
    const [output, setOutput] = useState([]);

    useEffect(() => {
        if (props.creationFlag == true) {
            setUpdate(true);

            if(props.nodes[props.id].available_params == null) {
                //mesto za dodavanje parametara

                let nodes = [...props.nodes];

                nodes[props.id].available_params = ["index"];
                nodes[props.id].params = {
                    "index": null
                }
                props.setNodes(nodes);
            }
        }
    }, []);


    useEffect(() => {
        //if (props.creationFlag == false) {
            setInput(props.nodes[props.id].input_keys);
            setOutput(props.nodes[props.id].output_keys);
            setIndex(props.nodes[props.id].params["index"]);
        //}
    }, [props.nodes]);


    const onChange = () => {
        setUpdate(!update);
        if (update) {

            let nodes = [...props.nodes];
            nodes[props.id].input_keys = input;
            nodes[props.id].output_keys = output;
            nodes[props.id].params["index"] = index;
            
            props.setNodes(nodes);
            props.setUpdateFlag(1);
        }
    }

    const deleteNode = () => {
        let nodes = [...props.nodes];
        nodes.splice(props.id,1);
        props.setNodes(nodes);
        console.log(nodes);
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

    const changeIndex = (e) => {
        setIndex(e.target.value)

        if (props.creationFlag) {
            let nodes = [...props.nodes];
            nodes[props.id].params["index"] = e.target.value;
            props.setNodes(nodes);
        }
    }

    return (
        <div className="node">
            {details == 0 && <br />}
            <span onClick={() => setDetails(!details)}>
                <b>ModelEvaluator </b>
                {props.creationFlag &&
                    <button onClick={() => deleteNode()}>-
                    </button>}
            </span>
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
                            <table>
                                <tr>
                                    <th> Index: </th>
                                    <td>
                                        <input type="number" value={index} onChange={(e) => changeIndex(e)} />
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
                            <table className="NodeTable">
                                <tbody>
                                    <tr>
                                        <th> Index: </th>
                                        <td> {index ? index : 'null'} </td>
                                    </tr>
                                </tbody>
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