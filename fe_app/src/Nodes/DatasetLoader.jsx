import React, { useEffect,useState } from 'react';
import { useParams } from "react-router-dom";
import "../Flow.css";

export default function DatasetLoader(props){


    const [update,setUpdate] = useState(0);
    const [details,setDetails] = useState(0);

    const [items] = useState([
        "mnist","cifra10","cifra100","imdb","reuters","fashion_mnist","boston_housing"
    ])
    const [dataset,setDataset] =  useState();
    const [input,setInput] = useState([]);
    const [output,setOutput] = useState([]);

    useEffect(() => {
        setDataset(props.nodes[props.id]?.params["dataset"]);
        setInput(props.nodes[props.id].input_keys);
        setOutput(props?.nodes[props.id]?.output_keys);
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
            var nodes = props.nodes;
            var item =  dataset;
            
            nodes[props.id].params["dataset"] = item;
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
            <span onClick={() => setDetails(!details)}><b>DatasetLoader</b></span>
            
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
                        <br/>
                        DataSet:
                        <select id="dataset" value={dataset} onChange={e => setDataset(e.currentTarget.value)}>
                            {items.map(item => (
                                <option key={item} value={item}>{item}</option>
                            ))}
                        </select>
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
                        DataSet: <span> {dataset}</span>
                    </>
                    }
                    <br/><br/>
                    <button onClick={() => onChange()}>{update == 1 ? 'Submit' : 'Update'}</button>
                </div>  
            }
        </div>
    )
}