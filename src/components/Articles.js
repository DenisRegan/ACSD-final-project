/*
Component:Aricles.js
Student: Denis O Regan
Course : HDip in Web development
Module: Advanced client side development

component description:
This component will display the top news articles of interest which are provided by the free
 api  ms-finance at rapidapi.com -https://rapidapi.com/apidojo/api/ms-finance/
 The news article headline and corresponding image are extracted from the reposnse from the api
 and displayed using card format of differing sizes
*/
import { useState,useEffect } from "react"
import axios from 'axios'
import {Link} from 'react-router-dom';
import newsImage from '../assets/news.jpg'

function Articles(){
    const[articlesData, setArticlesData] = useState([])
    const[articleTitles,setArticleTitles]= useState([])

useEffect(() => { 
    getData();
    }, []);

//this query to api ms-finance will retrieve the top articles of interest
const options = {
    method: 'GET',
    url: 'https://ms-finance.p.rapidapi.com/articles/list',
    params: {
      performanceId: '0P0000OQN8'
    },
    headers: {
      'X-RapidAPI-Key': '6a41346b5amsh2cb670067fd9a61p15e360jsn07ec80331e8f',
      'X-RapidAPI-Host': 'ms-finance.p.rapidapi.com'
    }
  };

  async function getData(){
    try {
        const titlesArray = [] ;
        const picturesArray = [];
         const articleIDArray = []

        
        const response = await axios.request(options);
        const articleData = response.data

        console.log("article response.data")
        console.log(response.data)

        console.log(articleData);
        console.log("get data")

        const articlesArray = Object.entries(articleData)
        console.log(articlesArray)
        //get article titles
        const titles= articleData.map(function(title){
            
           
            return {title:title.Title,
                    id:title.Id} 
        })
        const items = ['Item 1', 'Item 2', 'Item 3', 'Item 4']
        setArticleTitles(titles) 

        
        console.log(articleTitles)

        
        
        
         
        
    
    } catch (error) {
        console.error(error);
    }
   
    
}
 
return(<div>
        <div className = "container">

        <div className="row">
        <img src={newsImage} class="img-fluid" alt="..."/>
        </div>
        
            {articleTitles.map((item,index) =>(
            
            
            <div class="card w-75 mb-3">
                <div class="card-body">
                <h5 class="card-title">{item.title}</h5>
                             
            </div>
            </div>
            
            
            ))}
        </div>{/*end container div */}



    </div>)

    
}
export default Articles