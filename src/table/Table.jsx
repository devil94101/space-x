import React,{useState} from 'react';
import './table.css';
import Modal from '../modal/Modal'
import {useLocation} from 'react-router-dom'
import {useHistory} from 'react-router-dom'
//icons
import CloseIcon from '@mui/icons-material/Close';
import ArticleIcon from '@mui/icons-material/Article';
import YouTubeIcon from '@mui/icons-material/YouTube';
import ChromeReaderModeIcon from '@mui/icons-material/ChromeReaderMode';
import CircularProgress from '@mui/material/CircularProgress';

function useQuery() {
    return new URLSearchParams(useLocation().search);
  }

function Table({data,load,perPage,page,setperPage,setPage,setFilter,setpastFilter,endDate,
    dateFilter,pastFilterFun,filterData,createQuery,filter,setstartDate,setendDate,startDate}) {
    const query = useQuery()
    const [open, setOpen] = useState(false)
    const [clickedData, setclickedData] = useState({})
    const history = useHistory()
    function isInt(value) {
        return !isNaN(value) || value===0
    }
    const handleClose =()=>{
        setOpen(false)
    }
    const handleOpen = (x,color,text,textColor) => {
        setOpen(true);
        setclickedData({...x,color,text,textColor})
      };
      let utcDate = ''
      if(open){
          let d = new Date(clickedData['launch_date_utc'])
          utcDate = d.toUTCString();
      }
      if(query.get('page') && isInt(query.get('page'))){
          if(query.get('page') != page){
            setPage(parseInt(query.get('page')))
          }
      }
      else{
          history.push(createQuery())
      }
      if(query.get('perPage') && isInt(query.get('perPage'))){
          if(query.get('perPage') != perPage){
            setperPage(parseInt(query.get('perPage')))
          }
      }
      else{
        history.push(createQuery())
    }
      if(query.get('status')){
          if(query.get('status')!=filter){
            setFilter(query.get('status'))
          }
          data=filterData(data,query.get('status'))
      }
      else{
        history.push(createQuery())
    }
      if(query.get('pastfilter')){
        data=pastFilterFun(data,query.get('status'),query.get('pastfilter'))
        setpastFilter(query.get('pastfilter'))
        
      }
      else if(query.get('startDate') && query.get('endDate')){
        data = dateFilter(data,query.get('status'),new Date(query.get('startDate')),new Date(query.get('endDate')))
        let x = {
            startDate:new Date(query.get('startDate')),
            endDate:new Date(query.get('endDate'))
        }
        if(x.startDate.toString()!=startDate){
            setstartDate(x.startDate)
        }
        if(x.endDate.toString()!=endDate){
            setendDate(x.endDate)
        }
      }
      console.log(data)
    return (
        <>
            <table className="table">
                <thead>
                    <tr onClick={handleOpen}>
                        <td>
                            No.
                        </td>
                        <td>
                            Launchpad(UTC)
                        </td>
                        <td>
                            Location
                        </td>
                        <td>
                            Mission
                        </td>
                        <td>
                            Orbit
                        </td>
                        <td>
                            Launch Status
                        </td>
                        <td>
                            Rocket
                        </td>
                    </tr>
                </thead>
                <tbody>
                      {data.length>0 && (
                          data.slice((page-1)*perPage,(page-1)*perPage+perPage).map( (ele,i)=>{
                              let d=new Date(ele['launch_date_utc']);
                              let date=d.toUTCString();
                              let color="";
                              let text = '';
                              let textColor='';
                              if(ele['launch_success']){
                                text='Success';
                                color="#e0f6ee";
                                textColor="#86aea1"
                              }
                              else if(ele['upcoming']){
                                text='Upcoming';
                                color="#d2b28a";
                                textColor="darkGreen"
                              }
                              else{
                                text='Failed';
                                color="#ffe0e3";
                                textColor="#af7e7e"
                              }
                              return(<tr key={i} onClick={()=>handleOpen(ele,color,text,textColor)}> 
                              <td>{ele['flight_number']}</td>
                              <td>{date}</td>
                              <td>{ele['launch_site']['site_name']}</td>
                              <td>{ele['mission_name']}</td>
                              <td>{ele['rocket']['second_stage']['payloads'][0]['orbit']}</td>
                              <td><span style={{
                                  backgroundColor:color,
                                  padding:"0.4rem 2rem",
                                  borderRadius:"15px",
                                  fontWeight:"bold",
                                  color:textColor
                              }}>{text}</span></td>
                              <td>{ele.rocket['rocket_name']}</td>
                              </tr>)
                          })
                      )}
                      
                </tbody>
            </table>
            {data.length===0&&!load&&(<div className="noData">
                No data found
            </div>)}
            {load&&(<div className="noData">
        <CircularProgress />
      </div>)}

      <Modal
        show={open}
      >
         {open&&(
          <div style={{
              position:"relative",
          }}> 
            <div style={{position:'absolute',top:0,right:0,cursor:'pointer'}}>
                <CloseIcon onClick={handleClose}/>
            </div>
            <div style={{
                display:"flex",
            }}>
                <div style={{marginRight:'20px'}}>
                    <img src={clickedData['links']['mission_patch_small']} style={{width:'75px'}} alt={clickedData['mission_name']}/>
                </div>
                <div style={{marginRight:'20px'}}>
                    <h3>{clickedData['mission_name']}</h3>
                    <p>{clickedData['rocket']['rocket_name']}</p>
                    <div style={{
                        display:"flex",
                        alignItems:"center"
                    }}>
                        <a href={clickedData['links']['article_link']}><ArticleIcon style={{fontSize:'15px',marginRight:"10px"}}/> </a>
                        <a href={clickedData['links']['wikipedia']}><ChromeReaderModeIcon style={{fontSize:'15px',marginRight:"10px"}}/></a>
                        <a href={clickedData['links']['video_link']}><YouTubeIcon style={{fontSize:'15px',marginRight:"10px"}}/></a>
                    </div>
                </div>
                <div>
                <span style={{
                                  backgroundColor:clickedData.color,
                                  padding:"0.4rem 1.5rem",
                                  borderRadius:"15px",
                                  fontWeight:"bold",
                                  color:clickedData.textColor,
                                  fontSize:'12px'
                              }}>{clickedData.text}</span>
                </div>
                
            </div>
            <div style={{marginTop:'15px'}}>
                <p style={{fontSize:'12px'}}>{clickedData.details+" "}<a href={clickedData.links['wikipedia']} target="_blank" rel="noreferrer">Wikipedia</a></p>
            </div>
            <div style={{marginTop:'30px'}}>
                <ul className="rocketList">
                    <li><p>Flight Number</p> <p>{clickedData.flight_number}</p></li>
                    <li><p>Mission Name</p><p>{clickedData.mission_name}</p></li>
                    <li><p>Rocket Type</p><p>{clickedData.rocket['rocket_type']}</p></li>
                    <li><p>Rocket Name</p><p>{clickedData.rocket['rocket_name']}</p></li>
                    <li><p>Manufacturer</p><p>{clickedData.rocket['second_stage']['payloads'][0]['manufacturer']}</p></li>
                    <li><p>Nationality</p><p>{clickedData.rocket['second_stage']['payloads'][0]['nationality']}</p></li>
                    <li><p>Launch Date</p> <p>{utcDate}</p></li>
                    <li><p>Payload Type</p> <p>{clickedData.rocket['second_stage']['payloads'][0]['payload_type']}</p></li>
                    <li><p>Orbit</p> <p>{clickedData.rocket['second_stage']['payloads'][0]['orbit']}</p></li>
                    <li><p>Launch Site</p> <p>{clickedData['launch_site']['site_name']}</p></li>
                </ul>
           </div>
          </div>)}
      </Modal>
      
            </>
    )
}

export default Table
