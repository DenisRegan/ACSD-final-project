import { useLocation } from 'react-router-dom';
import { useState,useEffect } from "react"
import axios from 'axios'
import forexImage from '../assets/forex.jpeg'



function CryptoExchange(){
    const [dataArray, setDataArray] = useState([]);

    const Currencies = {
        BTC: 'BTC - Bitcoin',
        ETH: 'ETH - Ethereum',
        XRP: 'XRP - XRP',
        LTC: 'LTC - Litecoin',
        BCH: 'BCH - Bitcoin Cash',
        ADA: 'ADA - Cardano',
        DOT: 'DOT - Polkadot',
        XLM: 'XLM - Stellar',
        LINK: 'LINK - Chainlink',
        BNB: 'BNB - Binance Coin',
        DOGE: 'DOGE - Dogecoin',
        USDT: 'USDT - Tether',
        USDC: 'USDC - USD Coin',
        SOL: 'SOL - Solana',
        UNI: 'UNI - Uniswap',
        MATIC: 'MATIC - Polygon',
        EOS: 'EOS - EOS',
        AAVE: 'AAVE - Aave',
        AVAX: 'AVAX - Avalanche',
        XTZ: 'XTZ - Tezos',
        TRX: 'TRX - TRON',
        USD: 'USD - United States Dollar',
        EUR: 'EUR - Euro',
        JPY: 'JPY - Japanese Yen',
        GBP: 'GBP - British Pound Sterling',
        AUD: 'AUD - Australian Dollar',
        CAD: 'CAD - Canadian Dollar',
        CHF: 'CHF - Swiss Franc',
        CNY: 'CNY - Chinese Yuan',
        SEK: 'SEK - Swedish Krona',
        NZD: 'NZD - New Zealand Dollar',
      };

    useEffect(() => {
        getData();
      }, []);

      const options = {
        method: 'GET',
        url: 'https://alpha-vantage.p.rapidapi.com/query',
        params: {
          from_currency: 'BTC',
          function: 'CURRENCY_EXCHANGE_RATE',
          to_currency: 'USD'
        },
        headers: {
          'X-RapidAPI-Key': '6a41346b5amsh2cb670067fd9a61p15e360jsn07ec80331e8f',
          'X-RapidAPI-Host': 'alpha-vantage.p.rapidapi.com'
        }
      };
      

      async function getData(){
        try {
            const response = await axios.request(options);
            
            console.log(response.data)
            const data = JSON.parse(response.data)
            console.log(data)
                
            
    
        }
        catch (error) {
            console.error(error);
        }
      }

  
    return(
            
            <div className="container">Crypto exchange component
                
                <div className="row">
                    
                </div>


                
               

            </div>)

} 
export default CryptoExchange