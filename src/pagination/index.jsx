import React from 'react'
import './style.css'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
function index({page,total,setpage,perPage,setperPage}) {
    
    const totalPages = total%perPage ===0 ? parseInt(total/perPage) : parseInt(total/perPage)+1;
    let arr = [...Array(totalPages+1).keys()]
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
        setpage(x)
    }
    const handleChange = (event) => {
        setperPage(event.target.value);
        setpage(1)
      };
    return (
        <div className="paginationDiv">
            <div style={{display:"flex",marginRight:'40px',alignItems:'center'}}>
                
            <FormControl sx={{m:1 ,border:'none',marginTop:'14px'}} variant="standard">
                <InputLabel id="demo-simple-select-helper-label" >Rows </InputLabel>
                <Select
                value={perPage}
                label="Age"
                onChange={handleChange}
                >
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={20}>20</MenuItem>
                </Select>
            </FormControl>
            </div>

            {page!==1&&(<div className="paginationBlock click" onClick={()=>handleClick(page-1)}><ArrowBackIosIcon 
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
            {(page!==totalPages && totalPages!==1)&&(<div className="paginationBlock click" onClick={()=>handleClick(page+1)}><ArrowForwardIosIcon 
             style={{fontSize:"10px"}}
             /></div>)}
        </div>
    )
}

export default index
