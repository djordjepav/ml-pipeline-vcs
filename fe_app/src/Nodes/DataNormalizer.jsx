import SelectInput from '@material-ui/core/Select/SelectInput';
import React, { forwardRef, useEffect, useState, useImperativeHandle, useCallback } from 'react';
import "../Flow/Flow.css";

export default function DataNormalizer(props) {


    const [update, setUpdate] = useState(0);
    const [details, setDetails] = useState(0);

    const [input, setInput] = useState([]);
    const [output, setOutput] = useState([]);


    useEffect(() => {
        if (props.creationFlag == true) {
            setUpdate(true);

            //mesto za dodavanje parametara, ovde ih nema
        }

    }, []);

    useEffect(() => {

        if (props.creationFlag == false) {
            setInput(props.nodes[props.id].input_keys);
            setOutput(props.nodes[props.id].output_keys);
        }
    }, [props.nodes]);


    const onChange = () => {

        setUpdate(!update);

        if (update) {
            
            let nodes = [...props.nodes];
            nodes[props.id].input_keys = input;
            nodes[props.id].output_keys = output;

            props.setNodes(nodes);

            props.setUpdateFlag(1);
        }
    }

    // const deleteNode = () => {
    //     let nodes = [...props.nodes];
    //     nodes.splice(props.id,1);
    //     props.setNodes(nodes);
    // }


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


    return (
        <div className="node">
            {details == 0 && <br />}
            <span onClick={() => setDetails(!details)}><b>DataNormalizer</b></span>
            {/* {props.creationFlag &&
            <button onClick={() => deleteNode()}>-</button>} */}
            {details == 1 &&
                <div>
                    <hr></hr>
                    {update ?

                        //Ako treba da se rade promene (update flag je postavljen na 1)
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
                        </>
                        :

                        //Ako je update flag 0, radi se samo prikaz
                        <>
                            <table className="NodeTable">
                                <thead>
                                    <tr>
                                        <th>
                                            Input keys:
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
                                    <tbodu>
                                        <tr>
                                            <td>
                                                null
                                        </td>
                                        </tr>
                                    </tbodu>
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