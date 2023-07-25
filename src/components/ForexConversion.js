/*
Component:Aricles.js
Student: Denis O Regan
Course : HDip in Web development
Module: Advanced client side development

component description:
This component will convert price in euro to diferent currencies selected by the euro, this 
component will also display 12 months of historical data for the price currency
There is a limitation in the api that only allows a base currency of euro for the free subscription
*/



import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Highcharts from 'highcharts/highstock'
import LineChart from 'highcharts-react-official'
import forexImage from '../assets/forex.jpeg'

function ForexConversion(){
    const initialValue = 1;
   
    const[todaysDate,setTodaysDate] = useState(new Date())//todays date
    const[baseCurrency,setBaseCurrency] = useState("EUR - Euro")//initialise base currency to euro
    const[baseCurrencySymbol,setBaseCurrencySymbol] = useState("EUR") //symbol will be used for api
    const[priceCurrency,setpriceCurrency] = useState("USD - United States Dollar")
    const[priceCurrencySymbol,setpriceCurrencySymbol] = useState("USD")
    const[valueToConvert, setValueToConvert] = useState(initialValue);//value to be converted
    const[convertedValue, setConvertedValue] = useState("")
    const[timeSeriesData, setTimeSeriesData] = useState([])
    const[latestPrices,setLatestPrices] = useState([])
    const[exchangeRate, setExchangeRate] = useState([])

    const[apiRequestOptions,setApiRequestOptions] = useState("")

    //start and end date of historical prices for linechart
    const[startDate,setStartDate] = useState("2022-07-25")//hardcoded for debugging&testing
    const[endDate,setEndDate] = useState("2023-07-25")//hardcoded for debugging&testing

    const[timeSeriesDates,setTimeSeriesDates] = useState([]);
    const[timeSeriesPrices,setTimeSeriesPrices] = useState([])


    useEffect(() => {
        getDate();
      }, []);
    async function getDate(){
        console.log("test useState date: " + todaysDate)
        let newDate = new Date()
        //console.log("newDate" + newDate)
        let date = newDate.getDate();
        console.log("date")
        console.log(date)
        let month = newDate.getMonth() + 1;
        //console.log(month)
        
        const month1yearago = new Date()
        month1yearago.setMonth(newDate.getMonth()-12)
        //console.log("1 year ago: " + month1yearago)

        let year = newDate.getFullYear();
        //console.log(year)
        
    }

    //First check local storage for latestprices, if not available or expired query the api
    useEffect(() => {
        getlatestPrices();
        getTimeSeriesData();
        
        }, []);
        

        /*
        
        const latestprices = JSON.parse(localStorage.getItem('latestprices'))
        const expiry = Date.parse(localStorage.getItem('expiry')) 
        if (latestprices && expiry && expiry > Date.now()){
          //console.log("within expiry ")
          setLatestPrices(latestprices)
          console.log(latestprices)

          console.log("startDatee: " + startDate)
          
          
   
          
     
         }
         else{
          console.log("expired"  )
          getlatestPrices();}
         
      }, []);
      //
        const exchangeR = latestPrices[priceCurrencySymbol];
      */

   

    //Get time series data
    
    
    /*
      //get data for linechart
    useEffect(() => {
        const dates = JSON.parse(localStorage.getItem('dates'))
        const prices = JSON.parse(localStorage.getItem('prices'))
        
        const datesArray = [
            '2022-07-15' ,
             '2022-07-16' ,
             '2022-07-17'
       
          ];
        setTimeSeriesDates(datesArray);
        console.log("local storage dates")
        console.log(timeSeriesDates)
        setTimeSeriesPrices(prices);
        

        const expiry = Date.parse(localStorage.getItem('expiry')) 
        if (dates && expiry && expiry > Date.now()){
          //console.log("within expiry ")
               
         }
         else{
          console.log("expired")
        getTimeSeriesData();}
        }, []);

        */


      async function getTimeSeriesData() {
        try {

          //options for querying api - https://rapidapi.com/principalapis/api/currency-conversion-and-exchange-rates
    
    const timeSeriesOptions= {
        method: 'GET',
        url: 'https://currency-conversion-and-exchange-rates.p.rapidapi.com/timeseries',
        params: {
          start_date: '2022-07-25',
          end_date: '2023-07-25',
          from: 'EUR',
          to: priceCurrency
        },
        headers: {
          'X-RapidAPI-Key': '6a41346b5amsh2cb670067fd9a61p15e360jsn07ec80331e8f',
          'X-RapidAPI-Host': 'currency-conversion-and-exchange-rates.p.rapidapi.com'
        }
      };

            
          const response = await axios.request(timeSeriesOptions);

          // following console.log for debugging 
          console.log("timeSeries: ");
          console.log(response)
          console.log("response.data.rates")
          console.log(response.data.rates);
          console.log("start date: " + startDate)
          console.log("end date: " , endDate)

          //setStartDate(response.data.start_date)
          //setEndDate(response.data.end_date)

      

            // Extract entries from returned object
            var timeSeries = Object.entries(response.data.rates);
            //localStorage.setItem('timeSeries', JSON.stringify(timeSeries))
            
            // Format the data
            const formattedTimeSeriesData = timeSeries.map(([date, prices]) => ({
                date:date,
                value: prices[priceCurrencySymbol],
            }));

            //sort data by date ascending as the api returns data and values unsorted
            const sortedArray=[...formattedTimeSeriesData].sort((a,b)=> a.date > b.date? 1 :-1, );
          
             console.log("SortedArray :")
             console.log(sortedArray)

            //split pair into 2 arrays for chart
            const dates = sortedArray.map(date =>date.date);
            const prices = sortedArray.map(price=>price.value);

            //save time series to local storage to reduce api calls
            //localStorage.setItem('dates', JSON.stringify(dates))
            //localStorage.setItem('prices', JSON.stringify(prices))
          
          
       

             console.log("dates")
             console.log( dates)
             console.log("prices" + prices)
            setTimeSeriesDates(dates);
            console.log("timeSeriesDates");
            console.log(timeSeriesDates)
            setTimeSeriesPrices(prices);
         
           
          
            
          
            } catch (error) {
          console.error('Error:', error);
        }
        
      }
    

    

      //async function retrieves conversion rate from api
      async function getlatestPrices() {
        const requestOptions= {
            method: 'GET',
            url: 'https://currency-conversion-and-exchange-rates.p.rapidapi.com/latest',
          
            params: {    
              from: 'EUR',
              to: priceCurrencySymbol
            },
            headers: {
              'X-RapidAPI-Key': '6a41346b5amsh2cb670067fd9a61p15e360jsn07ec80331e8f',
              'X-RapidAPI-Host': 'currency-conversion-and-exchange-rates.p.rapidapi.com'
            }
          };




        try {
     
          const response = await axios.request(requestOptions);

            
            console.log("response")
            console.log(response.data)
            setLatestPrices(response.data.rates)
            
           
         
          
        //remove local storage before project completion
        /*
          localStorage.setItem('latestprices', JSON.stringify(response.data.rates))
            var expiry = new Date()
            expiry.setSeconds(expiry.getSeconds()+360)
            localStorage.setItem('expiry',expiry)
            setLatestPrices(response.data.rates)
        */
            
            
            //setConvertedValue(response.data.result)
            //setExchangeRate(response.result)
            //console.log("Exchange rate")
            //console.log(exchangeRate)
        

        } catch (error) {
            console.error('Error:', error);
          }
       
      }
      //variable to for exchange rate , I found using a setState resulted in a delay 
      // updating the converted currency value
      const exchangeR = latestPrices[priceCurrencySymbol];
   //End rate of price currency  

    

    
    //Debugging function - using saved API data to reduce api calls as api allows a monthly max number of calls
    
    
    

    /* Currency List */
    const currencyList = [
        "AUD - Australian Dollar",
        "CAD - Canadian Dollar",
        "CHF - Swiss Franc",
        "CNY - Chinese Yuan",
        "GBP - British Pound Sterling",
        "HKD - Hong Kong Dollar",
        "JPY - Japanese Yen",
        "NOK - Norwegian Krone",
        "NZD - New Zealand Dollar",
        "RUB - Russian Ruble",
        "SEK - Swedish Krona",
        "TRY - Turkish Lira",
        "USD - United States Dollar"
        
        ];

    const currencyTable = {
        AUD: "AUD - Australian Dollar",
        BRL: "BRL - Brazilian Real",
        CAD: "CAD - Canadian Dollar",
        CHF: "CHF - Swiss Franc",
        CNY: "CNY - Chinese Yuan",
        GBP: "GBP - British Pound Sterling",
        HKD: "HKD - Hong Kong Dollar",
        INR: "INR - Indian Rupee",
        JPY: "JPY - Japanese Yen",
        KRW: "KRW - South Korean Won",
        MXN: "MXN - Mexican Peso",
        NOK: "NOK - Norwegian Krone",
        NZD: "NZD - New Zealand Dollar",
        RUB: "RUB - Russian Ruble",
        SEK: "SEK - Swedish Krona",
        TRY: "TRY - Turkish Lira",
        USD: "USD - United States Dollar"
        

    }
    //get symbol of currency
    function getKeyByValue(object, currency){
        return Object.keys(object).find(key =>object[key] === currency)//https://www.geeksforgeeks.org/how-to-get-a-key-in-a-javascript-object-by-its-value/
    }
    
      
    
    /* function handleBaseCurrency was written to handle the user changing the base
    currency, however it was found this api only provides a base currency of euro
    */
    function handleBaseCurrency(e){
        e.preventDefault()
        
        //setBaseCurrency(e.target.value)
        //setBaseCurrencySymbol(getKeyByValue(currencyTable,e.target.value));
        localStorage.removeItem('latestprices')
        getlatestPrices();
  

    }

    //function handlePriceCurrency will set setPriceCurrency & priceCurrencySymbol
    function handlePriceCurrency(e){
        setpriceCurrency(e.target.value)
        console.log("price test: " + priceCurrency)
        setpriceCurrencySymbol(getKeyByValue(currencyTable,e.target.value))
        getTimeSeriesData();
        getlatestPrices();
    }



     function handleConvertValue(e){
        setValueToConvert(e.target.value);
        console.log("test : value to convert")
        console.log("Convert Value: "+ valueToConvert)
        //setConvertedValue(exchangeRate * valueToConvert) 
    }

   
        
    
    //function for debugging
    function showCurrentCurrency(){
        console.log("New Base Currency:" + baseCurrency)
        console.log("New Base Currency symbol:" + baseCurrencySymbol)
        console.log("New price Currency:" + priceCurrency)
        console.log("New price Currency symbol:" + priceCurrencySymbol)
        console.log(" ")
    }

    






   
    //Line chart Configuration
      const graphConfig= {

        title: {
            text: 'Historical Prices',
            align: 'left'
        },
    
        subtitle: {
            text: 'Historical Prices',
            align: 'left'
        },
    
        yAxis: {
            title: {
                text: 'Prices'
            }
        },
    
        xAxis: {
           
            //type: 'datetime',
            //labels:{format: '{value:%Y-%m-%d}'},
        },
      
    
    
    
    
        series:[{
            data: timeSeriesPrices,
          }],/* [ {


            name: 'Manufacturing',
            data: [24916, 37941, 29742, 29851, 32490, 30282,
                38121, 36885, 33726, 34243, 31050]
        },],*/
    
        responsive: {
            rules: [{
                condition: {
                    maxWidth: 500
                },
                chartOptions: {
                    legend: {
                        layout: 'horizontal',
                        align: 'center',
                        verticalAlign: 'bottom'
                    }
                }
            }]
        }
    
    }
    




return(<div className="container">
            <div className="row">
            <img src={forexImage} class="img-fluid" alt="forex Image"/>
            
            
            </div>
    	    
            <div className="row">
           

                <div className="conversion-container-group">
                        <div className="conversion-container">
                            <select className="form-select form-select-sm" aria-label=".form-select-sm example" onChange={handleBaseCurrency} >
                                <option selected>{baseCurrency}</option>
                                
                            </select>
                            <input className ="conversion-input" type="number" value={valueToConvert} onChange={handleConvertValue} defaultValue={initialValue} />

                        </div>
                        <span className="currency-switch-btn"></span>

                        

                        <div className="conversion-container">
                            <select className="form-select form-select-sm" aria-label=".form-select-sm example" onChange={handlePriceCurrency}>
                                <option selected>{priceCurrency}</option>
                                {currencyList.map((currency, index) => (
                                    <option key={index}>{currency}</option>
                                ))}
                            </select>
                            <input className ="conversion-input" type="number" value={valueToConvert*exchangeR} onChange={()=> {}} />

                        </div>
                        
                </div>
                <LineChart highcharts = {Highcharts} options={graphConfig} />

            </div>

        </div>)  
          
}
export default ForexConversion