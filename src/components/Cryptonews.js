/*
Component:Aricles.js
Student: Denis O Regan
Course : HDip in Web development
Module: Advanced client side development

component description:
This component will display top crypto news articles, a button can take user to the actual
article

status: working
*/




import { useLocation } from 'react-router-dom';
import { useState,useEffect } from "react"
import axios from 'axios'
import Cryptoimage from '../assets/crypto-image.jpeg'


function Cryptonews(){
    const[articles, setArticles] = useState([])

    useEffect(() => {
        getData();
      }, []);

      const options = {
        method: 'GET',
        url: 'https://crypto-news16.p.rapidapi.com/news/coincu',
        headers: {
          'X-RapidAPI-Key': '6a41346b5amsh2cb670067fd9a61p15e360jsn07ec80331e8f',
          'X-RapidAPI-Host': 'crypto-news16.p.rapidapi.com'
        }
      };
      

      async function getData(){
        try {
            const response = await axios.request(options);
            
            console.log(response)

            const articles = response.data.map(function(article){
            
           
                return {title:article.title,
                        description:article.description,
                        date:article.date,
                        url:article.url} 
            })
            setArticles(articles)
           
                
            
    
        }
        catch (error) {
            console.error(error);
        }
      }


    return(
        <div className="container">

              <div className="row">
                <img src={Cryptoimage} class="img-fluid" alt="..."/>
              </div>


                {articles.map((item,index) =>(
            
                <div className="card w-75 mb-3">
                  <div className="card-body">
                    <h5 className="card-title">{item.title}</h5>
                    <a href={item.url} class="btn btn-primary" >View aricle</a>
                  </div>
                </div>
                ))}
        </div>)
}
export default Cryptonews