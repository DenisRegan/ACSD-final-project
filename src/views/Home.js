import {Link} from 'react-router-dom'
import {useState} from 'react'
import Article from '../components/Article'
import Articles from '../components/Articles'
import ForexConversion from '../components/ForexConversion'




function Home(){
    return(<div>Home 
    <Link to="/Articlespage"> Articlespage </Link> |
    <Link to="/Forexpage"> Forex Conversion </Link>

   
    
    </div>)
}
export default Home