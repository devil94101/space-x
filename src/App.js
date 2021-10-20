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
  Link,Redirect} from 'react-router-dom';
function App() {

  const [state, setState] = useState([])
  const [page, setpage] = useState(1)
  const [perPage, setperPage] = useState(10)
  const [load, setload] = useState(false)
  const [total, settotal] = useState(0)
  const [filter,setFilter] =useState('all')
  const [pastFilter, setpastFilter] = useState('')
  const [startDate, setstartDate] = useState('')
  const [endDate, setendDate] = useState('')


  const filterData = (xx,filter)=>{
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
    settotal(()=>x.length)
    return x;
  }

  const pastFilterFun = (data,filter,pastFilter) =>{
    //past date filter function
    let today = new Date();
    if(pastFilter==='Past Week'){
      let filterDate = new Date(today.getFullYear(),today.getMonth(),today.getDate()-7)
      return filterData(data.filter(ele=>{
        let d = new Date(ele['launch_date_utc']);
        if(d>=filterDate){
          return true;
        }
        return false;
      }),filter)
    }
    else if(pastFilter === 'Past Month'){
      let filterDate = new Date(today.getFullYear(),today.getMonth()-1,today.getDate())
      return filterData(data.filter(ele=>{
        let d = new Date(ele['launch_date_utc']);
        if(d>=filterDate){
          return true;
        }
        return false;
      }),filter)
    }
    else if(pastFilter === 'Past 3 Month'){
      let filterDate = new Date(today.getFullYear(),today.getMonth()-3,today.getDate())
      return filterData(data.filter(ele=>{
        let d = new Date(ele['launch_date_utc']);
        if(d>=filterDate){
          return true;
        }
        return false;
      }),filter)
    }
    else if(pastFilter === 'Past 6 Month'){
      let filterDate = new Date(today.getFullYear(),today.getMonth()-6,today.getDate())
      return filterData(data.filter(ele=>{
        let d = new Date(ele['launch_date_utc']);
        if(d>=filterDate){
          return true;
        }
        return false;
      }),filter)
    }
    else if(pastFilter === 'Past Year'){
      let filterDate = new Date(today.getFullYear()-1,today.getMonth(),today.getDate())
      return filterData(data.filter(ele=>{
        let d = new Date(ele['launch_date_utc']);
        if(d>=filterDate){
          return true;
        }
        return false;
      }),filter)
    }
    else if(pastFilter === 'Past 2 Year'){
      let filterDate = new Date(today.getFullYear()-2,today.getMonth(),today.getDate())
      return filterData(data.filter(ele=>{
        let d = new Date(ele['launch_date_utc']);
        if(d>=filterDate){
          return true;
        }
        return false;
      }),filter)
    }
    else {

      return filterData(data,filter)
    }
  }

  const dateFilter = (state,filter,startDate,endDate)=>{
    //custom date filter
    console.log(startDate,endDate)
    if((startDate && endDate) && startDate!==endDate){
      let x = state.filter(ele=>{
        let d = new Date(ele.launch_date_utc)
        let startD = new Date(startDate)
        let endD = new Date(endDate)
        if(d>=startD && d<=endD){
          return true;
        }
        return false;
      })
      return filterData(x,filter)
    }
    else {
      
      return filterData(state,filter)
    }
  }

  useEffect(() => {
    //for api call
    setload(true)
    axios.get('https://api.spacexdata.com/v3/launches/')
    .then(res=>{
      setState(res.data);
      setload(false)
      settotal(res.data.length)
    }).catch(err=>{
      console.log(err.message);
      setload(false);
    })
   
  }, [])

  const createQuery=(page,perPage,filter,pastFilter,startDate,endDate)=>{
    page=page?page:1
    perPage=perPage?perPage:10
    filter=filter?filter:'all'
    let query = `filters?page=${page}&perPage=${perPage}&status=${filter}`;
    if(pastFilter){
      query+=`&pastfilter=${pastFilter.toString()}`
    }
    else if(startDate && endDate){
      let date1 = new Date(startDate)
      let date2 = new Date(endDate)
      query+=`&startDate=${date1.toUTCString()}&endDate=${date2.toUTCString()}`
    }
    return query;
  }

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
          <Filter setFilter={setFilter} filter={filter} page={page} perPage={perPage} setstartDate={setstartDate} endDate={endDate}
          pastFilter={pastFilter} setpastFilter={setpastFilter} createQuery={createQuery} setendDate={setendDate} startDate={startDate}/>
        </div>
     
      </div>
        <Switch path="/">
            <Route >
            <Table data={state} load={load} perPage={perPage} setperPage={setperPage} page={page} setstartDate={setstartDate} setendDate={setendDate}
            filterData={filterData} setPage={setpage} setFilter={setFilter} setpastFilter={setpastFilter} pastFilterFun={pastFilterFun}
            createQuery={createQuery} filter={filter} dateFilter={dateFilter} startDate={startDate} endDate={endDate}/>
              </Route>
        </Switch>
      </div>
      <Pagination page={page} total={total} setpage={setpage} perPage={perPage} pastFilter={pastFilter} startDate={startDate}
       setperPage={setperPage} createQuery={createQuery} filter={filter} endDate={endDate} />
    </div>
    </Router>
  );
}

export default App;
