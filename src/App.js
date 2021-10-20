import './App.css';
import axios from 'axios';
import {useState,useEffect} from 'react'
import Table from './table/Table';
import Header from './header/header';
import Filter from './filter/filter';
import Pagination from './pagination';
import { BrowserRouter as Router,
  Switch,
  Route,
  Link} from 'react-router-dom';
function App() {

  const [filter, setFilter] = useState(localStorage.getItem('filter')?localStorage.getItem('filter'):'all');
  const [state, setState] = useState([])
  const [page, setpage] = useState(1)
  const [perPage, setperPage] = useState(localStorage.getItem('perPage')?parseInt(localStorage.getItem('perPage')):10)
  const [filteredData, setfilteredData] = useState([])
  const [load, setload] = useState(false)
  const [total, settotal] = useState(0)
  const [pastFilter, setpastFilter] = useState('')
  const [byDate, setbyDate] = useState({
    startDate:null,
    endDate:null
  })

  const filterData = (xx)=>{
    //status filter function
    
    const x = xx.filter(ele=>{
      if(filter === 'all'){
        return true;
      }
      else if(filter === "successful" && ele['launch_success']){
          return true;
      }
      else if(filter === 'upcoming' && ele['upcoming']){
          return true;
      }
      else if(filter === 'failed' && !ele['launch_success'] && !ele['upcoming']){
        return true;
      }
      return false;
    })
    setfilteredData(()=>x)
    settotal(()=>x.length)
  }

  const pastFilterFun = (data) =>{
    //past date filter function
    let today = new Date();
    if(pastFilter==='Past Week'){
      let filterDate = new Date(today.getFullYear(),today.getMonth(),today.getDate()-7)
      filterData(data.filter(ele=>{
        let d = new Date(ele['launch_date_utc']);
        if(d>=filterDate){
          return true;
        }
        return false;
      }))
    }
    else if(pastFilter === 'Past Month'){
      let filterDate = new Date(today.getFullYear(),today.getMonth()-1,today.getDate())
      filterData(data.filter(ele=>{
        let d = new Date(ele['launch_date_utc']);
        if(d>=filterDate){
          return true;
        }
        return false;
      }))
    }
    else if(pastFilter === 'Past 3 Month'){
      let filterDate = new Date(today.getFullYear(),today.getMonth()-3,today.getDate())
      filterData(data.filter(ele=>{
        let d = new Date(ele['launch_date_utc']);
        if(d>=filterDate){
          return true;
        }
        return false;
      }))
    }
    else if(pastFilter === 'Past 6 Month'){
      let filterDate = new Date(today.getFullYear(),today.getMonth()-6,today.getDate())
      filterData(data.filter(ele=>{
        let d = new Date(ele['launch_date_utc']);
        if(d>=filterDate){
          return true;
        }
        return false;
      }))
    }
    else if(pastFilter === 'Past Year'){
      let filterDate = new Date(today.getFullYear()-1,today.getMonth(),today.getDate())
      filterData(data.filter(ele=>{
        let d = new Date(ele['launch_date_utc']);
        if(d>=filterDate){
          return true;
        }
        return false;
      }))
    }
    else if(pastFilter === 'Past 2 Year'){
      let filterDate = new Date(today.getFullYear()-2,today.getMonth(),today.getDate())
      filterData(data.filter(ele=>{
        let d = new Date(ele['launch_date_utc']);
        if(d>=filterDate){
          return true;
        }
        return false;
      }))
    }
    else {

      filterData(data)
    }
  }

  const dateFilter = (state)=>{
    //custom date filter
    if((byDate.startDate && byDate.endDate) && byDate.startDate!==byDate.endDate){
      let x = state.filter(ele=>{
        let d = new Date(ele.launch_date_utc)
        let startD = new Date(byDate.startDate)
        let endD = new Date(byDate.endDate)
        if(d>=startD && d<=endD){
          return true;
        }
        return false;
      })
      pastFilterFun(x)
    }
    else {
      
      pastFilterFun(state)
    }
  }

  useEffect(() => {
    //for api call
    setload(true)
    axios.get('https://api.spacexdata.com/v3/launches/')
    .then(res=>{
      setState(res.data);
      setload(false)
      dateFilter(res.data);
    }).catch(err=>{
      console.log(err.message);
      setload(false);
    })
   
  }, [])

  useEffect(()=>{
    //filter according to status
    setpage(()=>1)
    dateFilter(state)
    localStorage.setItem('filter',filter);
  },[filter])

  useEffect(()=>{
    localStorage.setItem('perPage',perPage)
  },[perPage])

  useEffect(()=>{
    setpage(()=>1)
    dateFilter(state)
  },[byDate,pastFilter])

  return (
    <Router>
    <div className="App">
        <Header/>
      <div style={{
        overflowX:'auto'
      }}> 
      <div style={{
        height:"100px",
        width:"100%",
        justifyContent:"center",
        alignItems:"center",
        display:"flex"
      }}>
        <div style={{
          width:"80%",
          justifyContent:"space-between",
          display:"flex",
          alignItems:"center",
          }}> 
          <Filter filter={filter} setFilter={setFilter} pastFilter={pastFilter}
           setpastFilter={setpastFilter} byDate={byDate} setbyDate={setbyDate}/>
        </div>
     
      </div>
      <Table data={filteredData} load={load} perPage={perPage} setperPage={setperPage} page={page}/>
      </div>
      <Pagination page={page} total={total} setpage={setpage} perPage={perPage} setperPage={setperPage}/>
    </div>
    </Router>
  );
}

export default App;
