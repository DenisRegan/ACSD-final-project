/*
Component:Aricles.js
Student: Denis O Regan
Course : HDip in Web development
Module: Advanced client side development

page description:
Used to display article text using the article component
state prop id must be passed from Articles.js component
*/



import { useState,useEffect } from "react"
import axios from 'axios'
import Articles from "../components/Articles"
import {Link, useLocation} from 'react-router-dom'
import Article from '../components/Article'


function ArticlePage(props){

  
   const location = useLocation()
    const {id} = location.state;
    
    return(<div className = "container"> ArticlePage
             <h2>article id: {id}</h2>
             <Article id={id}/>
          </div>
    
    )
    
}

export default ArticlePage