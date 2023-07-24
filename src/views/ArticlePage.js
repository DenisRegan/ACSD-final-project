import { useState,useEffect } from "react"
import axios from 'axios'
import Articles from "../components/Articles"
import {Link, useLocation} from 'react-router-dom'
import Article from '../components/Article'


function ArticlePage(){

   

    const location = useLocation()
    console.log( location)
    const stateData = location.state;
    console.log("stateData")
    console.log(stateData.articleId.article1ID)
    

 
    return(<div className = "container"> Article 

           

    
    
    
          </div>
    
    )
    
}

export default ArticlePage