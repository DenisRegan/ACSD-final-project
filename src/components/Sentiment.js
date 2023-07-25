import { useLocation } from 'react-router-dom';
import { useState,useEffect } from "react"
import axios from 'axios'


function Sentiment(){


    useEffect(() => {
        getData();
      }, []);

      const options = {
        method: 'GET',
        url: 'https://finance-social-sentiment-for-twitter-and-stocktwits.p.rapidapi.com/get-sentiment-change/bullish',
        params: {
          social: 'twitter',
          isCrypto: 'false',
          timestamp: '24h',
          limit: '10'
        },
        headers: {
          'Content-Type': 'application/json',
          'X-RapidAPI-Key': '6a41346b5amsh2cb670067fd9a61p15e360jsn07ec80331e8f',
          'X-RapidAPI-Host': 'finance-social-sentiment-for-twitter-and-stocktwits.p.rapidapi.com'
        }
      };
      

      async function getData(){
        try {
            const response = await axios.request(options);
            
            console.log("Sentiment")
            console.log(response)

            
                
            
    
        }
        catch (error) {
            console.error(error);
        }
      }

    return(
        <div>Sentiment
        
        </div>)
}

export default Sentiment