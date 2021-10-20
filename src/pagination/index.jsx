import React from 'react'
import './style.css'
import Select from '../select';
import {withRouter,useHistory} from 'react-router-dom';
//icons 
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

function Pagination({page,total,perPage,createQuery,filter,pastFilter,startDate,endDate}) {
    
    const totalPages = total%perPage ===0 ? parseInt(total/perPage) : parseInt(total/perPage)+1;
    let arr = [...Array(totalPages+1).keys()]
    const history = useHistory()
    let pageArr = []
    if(totalPages<6){
        pageArr=[...arr.slice(1)];
    }
    else if(page<5){
        pageArr = [...arr.slice(1,page+2),'...',totalPages-1,totalPages]
    }
    else if(page>totalPages-3){
        pageArr = [1,2,'...',...arr.slice(page-1,totalPages+1)]
    }
    else{
        pageArr = [1,2,'...',...arr.slice(page-1,page+2),'...',totalPages-1,totalPages]
    }
    const handleClick = (x)=>{
        history.push(createQuery(x,perPage,filter,pastFilter,startDate,endDate))
    }
    const handleChange = (event) => {
        history.push(createQuery(page,event.target.value,filter,pastFilter,startDate,endDate))
      };
      const rowsArr=[{
          text:"5",
          value:5,
      },{
          text:"10",
          value:10
      },{
        text:"15",
        value:15
    },{
        text:"20",
        value:20
    }]
    return (
        <div className="paginationDiv">
            <div style={{display:"flex",marginRight:'40px',alignItems:'center'}}>
            <Select change={handleChange} value={perPage} data={rowsArr} />
            </div>

            {page!==1&&(<div className="paginationBlock click" onClick={()=>history.push(createQuery(page-1,perPage,filter,pastFilter,startDate,endDate))}><ArrowBackIosIcon 
            style={{fontSize:"10px"}}
            /></div>)}
            {pageArr.map((ele,i)=>{
                if(ele==="..."){
                    return <div key={i} className="paginationBlock">{ele}</div>
                }
                else if(ele === page){
                    return <div key={i} className="paginationBlock clicked">{ele}</div>   
                }
                else{
                    return <div key={i} className="paginationBlock click" onClick={()=>handleClick(ele)}>{ele}</div>
                }
            })}
            {(page!==totalPages && totalPages!==1 && totalPages!=0)&&(<div className="paginationBlock click" onClick={()=>history.push(createQuery(page+1,perPage,filter,pastFilter,startDate,endDate))}><ArrowForwardIosIcon 
             style={{fontSize:"10px"}}
             /></div>)}
        </div>
    )
}

export default withRouter(Pagination)
