import React, { useEffect,useState } from 'react';
import "../Flow.css";

export default function ModelPredictor(props){

    const [details,setDetails] = useState(0);
    const [update,setUpdate] = useState(0);

    const [index,setIndex] = useState();

    const [input,setInput] = useState([]);
    const [output,setOutput] = useState([]);

    useEffect(() => {
        setIndex(props.node.params["index"]);
        setInput(props.node.input_keys);
        setOutput(props.node.output_keys);
        //console.log(props.nodes);
        //if(props.nodes[props.id].input_keys.length == 0)
            //console.log("ZNOPRA");
        //console.log(props?.nodes[props.id]?.input_keys);
    },[props.nodes] );



    const onChange = () =>
    {
        setUpdate(!update);
        if(update)
        {
            //console.log("upisujem");
            //var nodes = props.nodes;
            
            props.node.params["index"] = index;
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
            <span onClick={() => setDetails(!details)}><b>ModelPredictor</b></span>
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
                    <table>
                        <tr>
                            <th> Index: </th>
                            <td>
                                <input type="number" value={index} onChange={(e) => setIndex(e.target.value)} />
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
                    <table className="NodeTable">
                        <tr>
                            <th> Index: </th>
                            <td> {index?index:'null'} </td>
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