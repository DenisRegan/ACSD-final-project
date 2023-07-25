import {Link} from 'react-router-dom'
import {useState} from 'react'

import Articlespage from './Articlespage'
import Forexpage from './Forexpage'
import Cryptonewspage from './Cryptonewspage'



function Home(){
    return(<div>Home | 

    <Link to="/Forexpage"> Forex Conversion </Link> |
    <Link to="/Cryptonewspage"> Cryptonews </Link> |
    <Link to="/Articlespage"> Articlespage </Link> |

     
   

  
   

   
    
    </div>)
}
export default Home