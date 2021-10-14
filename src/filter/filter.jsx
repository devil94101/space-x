import React,{useState} from 'react'
import './filter.css'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

function Filter({filter,setFilter,pastFilter,setpastFilter,byDate,setbyDate}) {
    
  const [open, setOpen] = useState(false)
  const [startDate, setstartDate] = useState(null)
  const [endDate, setendDate] = useState(null)
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
    borderRadius:'4px',
  };
  const handleChange = (event) => {
    setFilter(event.target.value);
  };

  const handleClose =()=>{
    setOpen(false)
}
const handleOpen = () => {
    setOpen(true);
  };
  const setpastFilterValue =(value)=>{
    setpastFilter(value)
    handleClose()
  }
  const onChangeStart =(val)=>{
    setstartDate(val);
    if(endDate){
      let x = {
        startDate:val,
        endDate
      }
      setbyDate(prev=>{return {...x}})
      setpastFilter(prev=>'')
      handleClose()
    }
  }
  const onChangeEnd =(val)=>{
    console.log(new Date(byDate))
    setendDate(val);
    if(startDate){
      let x = {
        startDate,
        endDate:val
      }
      setbyDate(prev=>{return {...x}})
      setpastFilter(prev=>'')
      handleClose()
    }
  }
    return (
        <div style={{
            display:"flex",
            justifyContent:"space-between",
            width:"100%"
        }}>
        <div onClick={handleOpen} style={{cursor:"pointer"}}>
          <p>{pastFilter===''?'Filter By Time':pastFilter}</p>
        </div>
        <div>
        <FormControl sx={{m:1, minWidth: 200 }} variant="standard">
        <InputLabel ></InputLabel>
        <Select
          value={filter}
          label="Filter"
          onChange={handleChange}
        >
          <MenuItem value='all'>All Launches</MenuItem>
          <MenuItem value='upcoming'>Upcoming Launches</MenuItem>
          <MenuItem value='successful'>Successful Launches</MenuItem>
          <MenuItem value='failed'>Failed Launches</MenuItem>
        </Select>
      </FormControl>
        </div>
        <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <Box sx={{ ...style,outline:'none'}}>
          <div className="boxdiv">
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
        </Box>
      </Modal>
        </div>
    )
}

export default Filter
