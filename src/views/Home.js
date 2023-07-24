import {Link} from 'react-router-dom'
import {useState} from 'react'
import Article from '../components/Article'
import Articles from '../components/Articles'
import ForexConversion from '../components/ForexConversion'


import Cryptonews from '../components/Cryptonews'

function Home(){
    return(<div>Home | 
     <Link to="/Articlepage"> Articlepage </Link> |
    <Link to="/Articlespage"> Articlespage </Link> |
    <Link to="/Forexpage"> Forex Conversion </Link> | 
    <Link to="/CryptoExchangepage"> CryptoExchange </Link>

    <Cryptonews />

   
    
    </div>)
}
export default Home