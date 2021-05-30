import React, { useEffect,useState } from 'react';
import "../Flow/Flow.css";

export default function DataStandardizer(props){

    const [update,setUpdate] = useState(0);
    const [details,setDetails] = useState(0);

    const [input,setInput] = useState([]);
    const [output,setOutput] = useState([]);


    useEffect(() => {
        if (props.creationFlag == true) {
            setUpdate(true);

            if(props.nodes[props.id].available_params == null) {
                //mesto za dodavanje parametara

                let nodes = [...props.nodes];

                nodes[props.id].available_params = [];
                
                props.setNodes(nodes);
            }
        }

    }, []);
    

    useEffect(() =>{
        //if (props.creationFlag == false) {
            setInput(props.nodes[props.id].input_keys);
            setOutput(props.nodes[props.id]?.output_keys);
        //}
    },[props.nodes]);


    const onChange = () =>
    {
        setUpdate(!update);
        if(update){

            let nodes = props.nodes;
            
            nodes[props.id].input_keys = input;
            nodes[props.id].output_keys = output;

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
            <span onClick={() => setDetails(!details)}>
                <b>DataStandardizer </b>
                {props.creationFlag &&
                    <button onClick={() => deleteNode()}>-
                    </button>}
            </span>
                {details == 1 &&
                <div>
                    <hr></hr>
                    {update?
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
                                                        <input className="inputNode" type="number" value={item} onChange={(e) => changeInput(index, e)} />
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
                    <br/>
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