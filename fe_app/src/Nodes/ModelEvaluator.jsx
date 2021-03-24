import React, { useEffect,useState } from 'react';
import "../Flow.css";

export default function ModelEvaluator(props){

    const [update,setUpdate] = useState(0);
    const [details,setDetails] = useState(0);

    const [input,setInput] = useState([]);
    const [output,setOutput] = useState([]);


    const [index,setIndex] = useState(
        {
            "available_params": [],
                "input_keys": [
                    "x_train",
                    "x_test"
                ],
                "output_keys": [
                    "x_train",
                    "x_test"
                ],
                "params": {},
                "type": "model_evaluator"
        }
    );
    
    const fja = () =>
    {
        // let items = [...props.nodes];
        // let item = {...items[props.id]};

        // item.params.dataset = "newmnist";
        // items[props.id] = item;

        // props.setNodes({items});

    }

    useEffect(() =>{
        setInput(props.nodes[props.id].input_keys);
        setOutput(props?.nodes[props.id]?.output_keys);
    },[props.nodes]);

    useEffect(() => {
        if(props.creationFlag)
        {
            let items = props.nodes;
            let item =  index;
            
            items[props.id] = item;

            props.setNodes(items);
        }

        //console.log(props.nodes[props.id]);
    },[] );


    const onChange = () =>
    {
        setUpdate(!update);
        if(update)
        {
            //console.log("upisujem");
            var nodes = props.nodes;
            
            nodes[props.id].input_keys = input;
            nodes[props.id].output_keys = output;

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
            <span onClick={() => setDetails(!details)}><b>ModelEvaluator</b></span>
                {details == 1 &&
                <div>
                    <hr></hr>
                    {update?
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
                    </>
                    }
                    <br/>
                    <button onClick={() => onChange()}>{update == 1 ? 'Submit' : 'Update'}</button>
                </div>  
            }
        </div>
    )
}