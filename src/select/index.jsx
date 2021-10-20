import React from 'react'
import './index.css'
function index({value,change,data}) {
    return (
        <div>
            <select value={value} onChange={change}>
                {data.map((ele,i)=>{
                    return(<option key={i} value={ele.value}>{ele.text}</option>)
                })}
            </select>
        </div>
    )
}

export default index
