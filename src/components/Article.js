
import { useLocation } from 'react-router-dom';
import { useState,useEffect } from "react"
import axios from 'axios'

 
function Article(props){
    //console.log(props.id)
    const[title, setTitle] = useState("")
    const[publishedDate, setPublishedDate] = useState("")
    

    useEffect(() => { 
      getData();
      }, []);
    
    const options = {
        method: 'GET',
        url: 'https://ms-finance.p.rapidapi.com/articles/get-details',
        params: {id: props.id},
        headers: {
          'X-RapidAPI-Key': '6a41346b5amsh2cb670067fd9a61p15e360jsn07ec80331e8f',
          'X-RapidAPI-Host': 'ms-finance.p.rapidapi.com'
        }
      };
    
    async function getData(){
    try {
        const response = await axios.request(options);
        
        setTitle(response.data.title)
        setPublishedDate(response.data.publishedDate)
        console.log(response.data.body)

	    

    }
    catch (error) {
        console.error(error);
    }

    }
    return(<div>Article
            <h2>article component:{props.id}</h2>
            <h3>{title}</h3>
            <h3>{publishedDate}</h3>

           </div>)
}
export default Article