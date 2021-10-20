import React,{useState} from 'react'
import './filter.css'
import Modal from '../modal/Modal';

import Select from '../select';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import {withRouter,useHistory} from 'react-router-dom';

//icons 
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import CloseIcon from '@mui/icons-material/Close';

function Filter({setpastFilter,pastFilter,filter,createQuery,page,perPage,startDate,endDate,setstartDate,setendDate}) {

  const [open, setOpen] = useState(false)
  
  const history = useHistory()

  const handleChange = (event) => {
    history.push(createQuery(1,perPage,event.target.value,pastFilter,startDate,endDate))
  };

  const handleClose =()=>{
    setOpen((open)=>!open)
  }
  const handleOpen = () => {
    setOpen(true);
  };
  const setpastFilterValue =(value)=>{
    handleClose()
    history.push(createQuery(1,perPage,filter,value,null,null))
  }
  const onChangeStart =(val)=>{
    let d = new Date(val)
    setstartDate(()=>val);
    if(endDate){
      let x = {
        startDate:val,
        endDate
      }
      setpastFilter(prev=>'')
      handleClose()
      history.push(createQuery(1,perPage,filter,'',val,endDate))
    }
  }
  const onChangeEnd =(val)=>{
    setendDate(val);
    if(startDate){
      let x = {
        startDate,
        endDate:val
      }
      setpastFilter(prev=>'')
      handleClose()
      history.push(createQuery(1,perPage,filter,'',startDate,val))
    }
  }
  const statusValues=[{
    text:"All Launches",
    value:"all"
  },{
    text:"Upcoming Launches",
    value:"upcoming"
  },{
    text:"Successful Launches",
    value:"successful"
  },{
    text:"Failed Launches",
    value:"failed"
  }]
    return (
        <div style={{
            display:"flex",
            justifyContent:"space-between",
            width:"100%"
        }}>
          {}
        <div onClick={handleOpen} style={{cursor:"pointer"}}>
          <p style={{display:'flex',alignItems:"center",fontSize:"14px"}}>{pastFilter===''?'Filter By Time':pastFilter}<span><ArrowDropDownIcon/></span></p>
        </div>
        <div>
          <Select value={filter} change={handleChange} data={statusValues}/>
        </div>
        <Modal
        show={open}
         >
         <div className="boxdiv">
         <div style={{position:'absolute',top:0,right:0,cursor:'pointer'}}>
                <CloseIcon onClick={handleClose}/>
            </div>
            <ul className="timeList">
              <li onClick={()=>setpastFilterValue('Past Week')}>Past Week</li>
              <li onClick={()=>setpastFilterValue('Past Month')}>Past Month</li>
              <li onClick={()=>setpastFilterValue('Past 3 Month')}>Past 3 Month</li>
              <li onClick={()=>setpastFilterValue('Past 6 Month')}>Past 6 Month</li>
              <li onClick={()=>setpastFilterValue('Past Year')}>Past Year</li>
              <li onClick={()=>setpastFilterValue('Past 2 Year')}>Past 2 Year</li>
            </ul>
            <div className="calendar">
              <div style={{margin:"0 20px"}}>
                <center>Start Date</center>
            <Calendar
                onChange={onChangeStart}
                value={startDate}
              />
              </div>
              <div style={{margin:"0 20px"}}>
                <center>End Date</center>
               <Calendar
                onChange={onChangeEnd}
                value={endDate}
              />
              </div>
            </div>
            </div>
            
      </Modal>
        </div>
    )
}

export default withRouter(Filter)
