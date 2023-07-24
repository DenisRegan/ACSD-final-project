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

    const[apiRequestOptions,setApiRequestOptions] = useState("")

    //start and end date of historical prices for linechart
    const[startDate,setStartDate] = useState("2022-07-15")//hardcoded for debugging&testing
    const[endDate,setEndDate] = useState("2023-07-15")//hardcoded for debugging&testing

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


   

    //Get time series data
    
    

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


      async function getTimeSeriesData() {
        try {

          //options for querying api - https://rapidapi.com/principalapis/api/currency-conversion-and-exchange-rates
    
    const timeSeriesOptions= {
        method: 'GET',
        url: 'https://currency-conversion-and-exchange-rates.p.rapidapi.com/timeseries',
        params: {
          start_date: '2022-07-15',
          end_date: '2023-07-14',
          from: 'EUR',
          to: priceCurrency
        },
        headers: {
          'X-RapidAPI-Key': '6a41346b5amsh2cb670067fd9a61p15e360jsn07ec80331e8f',
          'X-RapidAPI-Host': 'currency-conversion-and-exchange-rates.p.rapidapi.com'
        }
      };

            
          const response = await axios.request(timeSeriesOptions);
          console.log("timeSeries: ");
          console.log(response)
          console.log("response.data.rates")
          console.log(response.data.rates);

          

          setStartDate(response.data.start_date)
          setEndDate(response.data.end_date)
          console.log("start date: " + startDate)
          console.log("end date: " , endDate)

      

            // Extract entries from returned object
            var timeSeries = Object.entries(response.data.rates);
            localStorage.setItem('timeSeries', JSON.stringify(timeSeries))
            
            // Format the data
            const formattedTimeSeriesData = timeSeries.map(([date, prices]) => ({
                date:date,
                value: prices[priceCurrencySymbol],
            }));

            //sort data by date ascending as the api returns data and values unsorted
            const sortedArray=[...formattedTimeSeriesData].sort((a,b)=> a.date > b.date? 1 :-1, );
          
             console.log("SortedArray :")
             console.log(sortedArray)

            //split pair into 2 arrays
            const dates = sortedArray.map(date =>date.date);
            const prices = sortedArray.map(price=>price.value);

            //save time series to local storage to reduce api calls
            localStorage.setItem('dates', JSON.stringify(dates))
            localStorage.setItem('prices', JSON.stringify(prices))
          
          
       

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
    

    


      async function getlatestPrices() {
        const requestOptions= {
            method: 'GET',
            url: 'https://currency-conversion-and-exchange-rates.p.rapidapi.com/latest',
          
            params: {    
              from: 'USD',
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
          //const price = response.data.rates.USD; //working -> set to price Currency 
          
        
          localStorage.setItem('latestprices', JSON.stringify(response.data.rates))
            var expiry = new Date()
            expiry.setSeconds(expiry.getSeconds()+100000)
            localStorage.setItem('expiry',expiry)
            setLatestPrices(response.data.rates)
            
            
            //setConvertedValue(response.data.result)
            //setExchangeRate(response.result)
            //console.log("Exchange rate")
            //console.log(exchangeRate)
        

        } catch (error) {
            console.error('Error:', error);
          }
      }
    
   //End rate of price currency  

    

    
    //Debugging function - using saved API data to reduce api calls as api allows a monthly max number of calls
    
      useEffect(() => {
        const historicalPrices =[
            {
                "date": "2023-01-01",
                "value": 1.070452
            },
            {
                "date": "2023-04-15",
                "value": 1.110366
            },
            {
                "date": "2023-05-11",
                "value": 1.091179
            },
            {
                "date": "2023-01-26",
                "value": 1.089448
            },
            {
                "date": "2022-12-20",
                "value": 1.06253
            },
            {
                "date": "2022-07-21",
                "value": 1.022072
            },
            {
                "date": "2022-11-09",
                "value": 1.001445
            },
            {
                "date": "2022-07-24",
                "value": 1.019987
            },
            {
                "date": "2022-12-02",
                "value": 1.053685
            },
            {
                "date": "2022-12-25",
                "value": 1.066782
            },
            {
                "date": "2023-01-23",
                "value": 1.087217
            },
            {
                "date": "2023-03-29",
                "value": 1.084328
            },
            {
                "date": "2023-01-04",
                "value": 1.060839
            },
            {
                "date": "2023-04-10",
                "value": 1.086897
            },
            {
                "date": "2023-05-14",
                "value": 1.085234
            },
            {
                "date": "2023-02-27",
                "value": 1.060951
            },
            {
                "date": "2023-03-23",
                "value": 1.083517
            },
            {
                "date": "2023-07-14",
                "value": 1.124669
            },
            {
                "date": "2023-03-04",
                "value": 1.065019
            },
            {
                "date": "2023-06-10",
                "value": 1.076537
            },
            {
                "date": "2022-10-02",
                "value": 0.979235
            },
            {
                "date": "2022-11-06",
                "value": 0.993004
            },
            {
                "date": "2022-10-25",
                "value": 0.996338
            },
            {
                "date": "2022-09-14",
                "value": 0.998253
            },
            {
                "date": "2022-08-15",
                "value": 1.016162
            },
            {
                "date": "2022-09-11",
                "value": 1.007105
            },
            {
                "date": "2022-10-07",
                "value": 0.974013
            },
            {
                "date": "2022-11-03",
                "value": 0.974968
            },
            {
                "date": "2023-02-05",
                "value": 1.079051
            },
            {
                "date": "2023-07-11",
                "value": 1.10137
            },
            {
                "date": "2023-03-01",
                "value": 1.066906
            },
            {
                "date": "2023-06-15",
                "value": 1.094559
            },
            {
                "date": "2023-02-22",
                "value": 1.060556
            },
            {
                "date": "2023-03-26",
                "value": 1.07765
            },
            {
                "date": "2022-11-13",
                "value": 1.032818
            },
            {
                "date": "2022-10-17",
                "value": 0.984443
            },
            {
                "date": "2022-09-01",
                "value": 0.995198
            },
            {
                "date": "2022-10-30",
                "value": 0.995406
            },
            {
                "date": "2023-06-22",
                "value": 1.095768
            },
            {
                "date": "2023-04-28",
                "value": 1.112713
            },
            {
                "date": "2023-06-05",
                "value": 1.071145
            },
            {
                "date": "2023-03-11",
                "value": 1.065753
            },
            {
                "date": "2023-07-01",
                "value": 1.091643
            },
            {
                "date": "2023-02-15",
                "value": 1.069198
            },
            {
                "date": "2023-03-14",
                "value": 1.072729
            },
            {
                "date": "2023-07-04",
                "value": 1.088381
            },
            {
                "date": "2023-02-10",
                "value": 1.069919
            },
            {
                "date": "2023-05-29",
                "value": 1.070733
            },
            {
                "date": "2022-09-04",
                "value": 0.990908
            },
            {
                "date": "2022-07-19",
                "value": 1.023096
            },
            {
                "date": "2022-11-16",
                "value": 1.039426
            },
            {
                "date": "2022-10-12",
                "value": 0.970765
            },
            {
                "date": "2022-09-29",
                "value": 0.982922
            },
            {
                "date": "2022-10-18",
                "value": 0.986241
            },
            {
                "date": "2023-05-04",
                "value": 1.102256
            },
            {
                "date": "2023-01-14",
                "value": 1.084775
            },
            {
                "date": "2023-05-23",
                "value": 1.076936
            },
            {
                "date": "2023-04-27",
                "value": 1.103141
            },
            {
                "date": "2023-05-26",
                "value": 1.073134
            },
            {
                "date": "2023-04-22",
                "value": 1.10975
            },
            {
                "date": "2023-05-01",
                "value": 1.096851
            },
            {
                "date": "2023-04-05",
                "value": 1.090406
            },
            {
                "date": "2023-01-11",
                "value": 1.076414
            },
            {
                "date": "2022-11-19",
                "value": 1.03455
            },
            {
                "date": "2022-07-31",
                "value": 1.020668
            },
            {
                "date": "2022-12-30",
                "value": 1.072673
            },
            {
                "date": "2022-07-16",
                "value": 1.008695
            },
            {
                "date": "2023-01-13",
                "value": 1.084775
            },
            {
                "date": "2023-04-07",
                "value": 1.099621
            },
            {
                "date": "2023-03-19",
                "value": 1.067839
            },
            {
                "date": "2023-05-03",
                "value": 1.106856
            },
            {
                "date": "2023-04-20",
                "value": 1.096828
            },
            {
                "date": "2023-05-24",
                "value": 1.075558
            },
            {
                "date": "2022-09-09",
                "value": 1.015176
            },
            {
                "date": "2022-12-15",
                "value": 1.063886
            },
            {
                "date": "2022-12-10",
                "value": 1.054685
            },
            {
                "date": "2022-08-08",
                "value": 1.019727
            },
            {
                "date": "2023-04-25",
                "value": 1.097936
            },
            {
                "date": "2023-01-31",
                "value": 1.086106
            },
            {
                "date": "2023-05-21",
                "value": 1.082239
            },
            {
                "date": "2023-02-18",
                "value": 1.072036
            },
            {
                "date": "2023-04-02",
                "value": 1.080567
            },
            {
                "date": "2023-05-06",
                "value": 1.121026
            },
            {
                "date": "2023-06-25",
                "value": 1.090631
            },
            {
                "date": "2023-03-31",
                "value": 1.08707
            },
            {
                "date": "2023-02-12",
                "value": 1.067834
            },
            {
                "date": "2023-04-08",
                "value": 1.099621
            },
            {
                "date": "2023-03-16",
                "value": 1.061379
            },
            {
                "date": "2023-06-02",
                "value": 1.072558
            },
            {
                "date": "2022-10-10",
                "value": 0.970973
            },
            {
                "date": "2022-09-21",
                "value": 0.983038
            },
            {
                "date": "2022-08-02",
                "value": 1.015533
            },
            {
                "date": "2022-09-06",
                "value": 0.989761
            },
            {
                "date": "2022-08-07",
                "value": 1.017051
            },
            {
                "date": "2022-09-03",
                "value": 0.995768
            },
            {
                "date": "2022-10-15",
                "value": 0.972337
            },
            {
                "date": "2022-09-24",
                "value": 0.968964
            },
            {
                "date": "2023-02-17",
                "value": 1.071983
            },
            {
                "date": "2023-07-03",
                "value": 1.091274
            },
            {
                "date": "2023-03-13",
                "value": 1.072329
            },
            {
                "date": "2023-05-09",
                "value": 1.096431
            },
            {
                "date": "2023-06-20",
                "value": 1.092002
            },
            {
                "date": "2022-11-01",
                "value": 0.987884
            },
            {
                "date": "2022-07-29",
                "value": 1.022547
            },
            {
                "date": "2022-12-28",
                "value": 1.062869
            },
            {
                "date": "2022-08-17",
                "value": 1.017863
            },
            {
                "date": "2023-03-24",
                "value": 1.078046
            },
            {
                "date": "2023-06-30",
                "value": 1.091643
            },
            {
                "date": "2023-02-20",
                "value": 1.068319
            },
            {
                "date": "2023-05-19",
                "value": 1.082363
            },
            {
                "date": "2023-03-03",
                "value": 1.064917
            },
            {
                "date": "2023-07-13",
                "value": 1.12231
            },
            {
                "date": "2023-02-07",
                "value": 1.072938
            },
            {
                "date": "2023-06-12",
                "value": 1.076264
            },
            {
                "date": "2023-03-06",
                "value": 1.068661
            },
            {
                "date": "2023-04-18",
                "value": 1.097563
            },
            {
                "date": "2023-02-02",
                "value": 1.090477
            },
            {
                "date": "2023-03-21",
                "value": 1.077389
            },
            {
                "date": "2023-02-25",
                "value": 1.05842
            },
            {
                "date": "2022-11-23",
                "value": 1.041591
            },
            {
                "date": "2022-08-12",
                "value": 1.026352
            },
            {
                "date": "2022-11-04",
                "value": 0.998352
            },
            {
                "date": "2022-12-27",
                "value": 1.063683
            },
            {
                "date": "2022-08-18",
                "value": 1.008954
            },
            {
                "date": "2022-07-26",
                "value": 1.01292
            },
            {
                "date": "2023-05-16",
                "value": 1.086532
            },
            {
                "date": "2023-04-12",
                "value": 1.099699
            },
            {
                "date": "2023-02-08",
                "value": 1.071639
            },
            {
                "date": "2023-05-31",
                "value": 1.069347
            },
            {
                "date": "2023-01-21",
                "value": 1.087725
            },
            {
                "date": "2023-01-24",
                "value": 1.088779
            },
            {
                "date": "2023-04-30",
                "value": 1.101055
            },
            {
                "date": "2023-05-13",
                "value": 1.093967
            },
            {
                "date": "2023-03-09",
                "value": 1.058436
            },
            {
                "date": "2023-04-17",
                "value": 1.092502
            },
            {
                "date": "2023-01-03",
                "value": 1.054652
            },
            {
                "date": "2022-12-05",
                "value": 1.049659
            },
            {
                "date": "2022-07-23",
                "value": 1.021408
            },
            {
                "date": "2022-12-22",
                "value": 1.060165
            },
            {
                "date": "2022-10-28",
                "value": 0.996462
            },
            {
                "date": "2023-05-10",
                "value": 1.09837
            },
            {
                "date": "2023-04-14",
                "value": 1.110366
            },
            {
                "date": "2023-01-27",
                "value": 1.087251
            },
            {
                "date": "2022-12-21",
                "value": 1.060839
            },
            {
                "date": "2022-11-08",
                "value": 1.007927
            },
            {
                "date": "2022-07-20",
                "value": 1.018242
            },
            {
                "date": "2022-12-03",
                "value": 1.054085
            },
            {
                "date": "2022-07-25",
                "value": 1.022338
            },
            {
                "date": "2022-12-24",
                "value": 1.066776
            },
            {
                "date": "2023-03-28",
                "value": 1.083823
            },
            {
                "date": "2023-01-22",
                "value": 1.086461
            },
            {
                "date": "2023-05-15",
                "value": 1.087335
            },
            {
                "date": "2023-04-11",
                "value": 1.091716
            },
            {
                "date": "2023-01-05",
                "value": 1.052192
            },
            {
                "date": "2023-03-22",
                "value": 1.087004
            },
            {
                "date": "2023-02-26",
                "value": 1.055431
            },
            {
                "date": "2023-06-11",
                "value": 1.075061
            },
            {
                "date": "2023-03-05",
                "value": 1.062631
            },
            {
                "date": "2023-02-01",
                "value": 1.101248
            },
            {
                "date": "2022-11-07",
                "value": 1.001828
            },
            {
                "date": "2022-10-03",
                "value": 0.983173
            },
            {
                "date": "2022-09-15",
                "value": 0.998796
            },
            {
                "date": "2022-10-24",
                "value": 0.988616
            },
            {
                "date": "2022-09-10",
                "value": 1.015383
            },
            {
                "date": "2022-10-21",
                "value": 0.986144
            },
            {
                "date": "2022-11-02",
                "value": 0.981619
            },
            {
                "date": "2022-10-06",
                "value": 0.978871
            },
            {
                "date": "2023-06-14",
                "value": 1.08427
            },
            {
                "date": "2023-07-10",
                "value": 1.100558
            },
            {
                "date": "2023-02-04",
                "value": 1.082778
            },
            {
                "date": "2023-03-27",
                "value": 1.080672
            },
            {
                "date": "2023-02-23",
                "value": 1.059828
            },
            {
                "date": "2022-11-25",
                "value": 1.041445
            },
            {
                "date": "2023-07-09",
                "value": 1.096853
            },
            {
                "date": "2022-10-16",
                "value": 0.973904
            },
            {
                "date": "2023-07-08",
                "value": 1.097449
            },
            {
                "date": "2022-11-12",
                "value": 1.03729
            },
            {
                "date": "2022-10-31",
                "value": 0.988665
            },
            {
                "date": "2023-07-07",
                "value": 1.097449
            },
            {
                "date": "2023-07-06",
                "value": 1.089028
            },
            {
                "date": "2023-06-27",
                "value": 1.095686
            },
            {
                "date": "2023-04-29",
                "value": 1.112713
            },
            {
                "date": "2022-11-10",
                "value": 1.01942
            },
            {
                "date": "2023-06-23",
                "value": 1.09313
            },
            {
                "date": "2023-06-29",
                "value": 1.086767
            },
            {
                "date": "2023-02-14",
                "value": 1.073503
            },
            {
                "date": "2023-06-28",
                "value": 1.091548
            },
            {
                "date": "2023-03-10",
                "value": 1.065753
            },
            {
                "date": "2023-06-04",
                "value": 1.069745
            },
            {
                "date": "2023-02-11",
                "value": 1.070148
            },
            {
                "date": "2023-07-05",
                "value": 1.08554
            },
            {
                "date": "2023-03-15",
                "value": 1.058301
            },
            {
                "date": "2023-06-01",
                "value": 1.076044
            },
            {
                "date": "2023-06-26",
                "value": 1.091012
            },
            {
                "date": "2022-10-08",
                "value": 0.974013
            },
            {
                "date": "2023-05-28",
                "value": 1.072268
            },
            {
                "date": "2023-01-18",
                "value": 1.079727
            },
            {
                "date": "2022-08-01",
                "value": 1.026099
            },
            {
                "date": "2023-06-19",
                "value": 1.092395
            },
            {
                "date": "2022-11-30",
                "value": 1.042372
            },
            {
                "date": "2023-06-18",
                "value": 1.094032
            },
            {
                "date": "2023-06-17",
                "value": 1.09607
            },
            {
                "date": "2022-10-13",
                "value": 0.974943
            },
            {
                "date": "2023-06-16",
                "value": 1.09607
            },
            {
                "date": "2022-09-22",
                "value": 0.98401
            },
            {
                "date": "2022-08-21",
                "value": 1.003487
            },
            {
                "date": "2023-06-09",
                "value": 1.076537
            },
            {
                "date": "2023-06-08",
                "value": 1.078237
            },
            {
                "date": "2023-06-07",
                "value": 1.070709
            },
            {
                "date": "2023-06-06",
                "value": 1.06977
            },
            {
                "date": "2022-10-19",
                "value": 0.976615
            },
            {
                "date": "2022-11-28",
                "value": 1.034313
            },
            {
                "date": "2022-09-28",
                "value": 0.970784
            },
            {
                "date": "2023-01-15",
                "value": 1.082427
            },
            {
                "date": "2023-04-01",
                "value": 1.08707
            },
            {
                "date": "2022-07-30",
                "value": 1.022547
            },
            {
                "date": "2023-05-05",
                "value": 1.121026
            },
            {
                "date": "2023-04-26",
                "value": 1.104496
            },
            {
                "date": "2022-11-27",
                "value": 1.036683
            },
            {
                "date": "2023-05-22",
                "value": 1.08107
            },
            {
                "date": "2022-08-23",
                "value": 0.996656
            },
            {
                "date": "2023-04-23",
                "value": 1.099191
            },
            {
                "date": "2022-08-28",
                "value": 0.993833
            },
            {
                "date": "2023-05-27",
                "value": 1.073134
            },
            {
                "date": "2022-12-16",
                "value": 1.059714
            },
            {
                "date": "2023-01-10",
                "value": 1.07386
            },
            {
                "date": "2023-04-04",
                "value": 1.09583
            },
            {
                "date": "2022-11-20",
                "value": 1.033053
            },
            {
                "date": "2022-08-24",
                "value": 0.99676
            },
            {
                "date": "2023-01-06",
                "value": 1.066382
            },
            {
                "date": "2022-08-29",
                "value": 1.001252
            },
            {
                "date": "2023-01-19",
                "value": 1.083506
            },
            {
                "date": "2022-11-18",
                "value": 1.03455
            },
            {
                "date": "2022-07-17",
                "value": 1.009589
            },
            {
                "date": "2022-10-09",
                "value": 0.973468
            },
            {
                "date": "2022-12-31",
                "value": 1.072673
            },
            {
                "date": "2022-10-04",
                "value": 0.998398
            },
            {
                "date": "2023-05-02",
                "value": 1.101055
            },
            {
                "date": "2023-03-18",
                "value": 1.075211
            },
            {
                "date": "2023-04-06",
                "value": 1.091977
            },
            {
                "date": "2023-01-12",
                "value": 1.085977
            },
            {
                "date": "2022-11-17",
                "value": 1.036135
            },
            {
                "date": "2023-05-25",
                "value": 1.07241
            },
            {
                "date": "2022-11-29",
                "value": 1.032199
            },
            {
                "date": "2023-04-21",
                "value": 1.10975
            },
            {
                "date": "2023-01-07",
                "value": 1.066382
            },
            {
                "date": "2022-09-08",
                "value": 1.001051
            },
            {
                "date": "2022-09-18",
                "value": 1.002115
            },
            {
                "date": "2022-07-15",
                "value": 1.008695
            },
            {
                "date": "2022-12-14",
                "value": 1.067634
            },
            {
                "date": "2022-09-19",
                "value": 1.00245
            },
            {
                "date": "2022-10-20",
                "value": 0.977856
            },
            {
                "date": "2023-02-28",
                "value": 1.057686
            },
            {
                "date": "2022-12-11",
                "value": 1.052177
            },
            {
                "date": "2022-08-11",
                "value": 1.031513
            },
            {
                "date": "2022-09-05",
                "value": 0.995074
            },
            {
                "date": "2022-08-10",
                "value": 1.029919
            },
            {
                "date": "2022-07-28",
                "value": 1.019197
            },
            {
                "date": "2022-07-18",
                "value": 1.014482
            },
            {
                "date": "2022-08-04",
                "value": 1.024742
            },
            {
                "date": "2022-08-09",
                "value": 1.020778
            },
            {
                "date": "2022-08-05",
                "value": 1.018024
            },
            {
                "date": "2023-05-20",
                "value": 1.082363
            },
            {
                "date": "2023-01-30",
                "value": 1.084945
            },
            {
                "date": "2023-04-24",
                "value": 1.105767
            },
            {
                "date": "2023-05-07",
                "value": 1.101831
            },
            {
                "date": "2022-10-05",
                "value": 0.991066
            },
            {
                "date": "2023-04-03",
                "value": 1.091048
            },
            {
                "date": "2023-02-19",
                "value": 1.068492
            },
            {
                "date": "2023-03-30",
                "value": 1.090441
            },
            {
                "date": "2023-06-24",
                "value": 1.09313
            },
            {
                "date": "2023-01-16",
                "value": 1.082978
            },
            {
                "date": "2022-09-23",
                "value": 0.968964
            },
            {
                "date": "2023-06-03",
                "value": 1.072558
            },
            {
                "date": "2023-03-17",
                "value": 1.075211
            },
            {
                "date": "2023-04-09",
                "value": 1.091239
            },
            {
                "date": "2023-02-13",
                "value": 1.073008
            },
            {
                "date": "2022-09-20",
                "value": 0.997044
            },
            {
                "date": "2022-12-13",
                "value": 1.062632
            },
            {
                "date": "2022-10-11",
                "value": 0.969984
            },
            {
                "date": "2022-11-05",
                "value": 0.998352
            },
            {
                "date": "2022-08-26",
                "value": 0.996561
            },
            {
                "date": "2022-09-07",
                "value": 0.999535
            },
            {
                "date": "2022-12-09",
                "value": 1.054736
            },
            {
                "date": "2022-08-03",
                "value": 1.015729
            },
            {
                "date": "2022-10-27",
                "value": 0.996746
            },
            {
                "date": "2022-09-02",
                "value": 0.995768
            },
            {
                "date": "2022-09-17",
                "value": 1.00163
            },
            {
                "date": "2022-08-06",
                "value": 1.018024
            },
            {
                "date": "2022-09-25",
                "value": 0.968851
            },
            {
                "date": "2022-09-16",
                "value": 1.001532
            },
            {
                "date": "2022-10-14",
                "value": 0.972337
            },
            {
                "date": "2022-10-26",
                "value": 1.009158
            },
            {
                "date": "2023-05-08",
                "value": 1.099578
            },
            {
                "date": "2023-03-12",
                "value": 1.068331
            },
            {
                "date": "2023-07-02",
                "value": 1.090633
            },
            {
                "date": "2023-02-16",
                "value": 1.066555
            },
            {
                "date": "2022-11-11",
                "value": 1.037183
            },
            {
                "date": "2023-06-21",
                "value": 1.099139
            },
            {
                "date": "2023-01-09",
                "value": 1.073445
            },
            {
                "date": "2022-11-26",
                "value": 1.041445
            },
            {
                "date": "2023-01-08",
                "value": 1.065598
            },
            {
                "date": "2022-08-31",
                "value": 1.00387
            },
            {
                "date": "2022-11-24",
                "value": 1.040778
            },
            {
                "date": "2022-10-23",
                "value": 0.98595
            },
            {
                "date": "2022-08-16",
                "value": 1.01703
            },
            {
                "date": "2022-10-22",
                "value": 0.986144
            },
            {
                "date": "2022-12-29",
                "value": 1.066155
            },
            {
                "date": "2022-09-12",
                "value": 1.01292
            },
            {
                "date": "2022-09-13",
                "value": 0.998054
            },
            {
                "date": "2023-02-21",
                "value": 1.065167
            },
            {
                "date": "2022-08-30",
                "value": 1.002471
            },
            {
                "date": "2023-03-25",
                "value": 1.078162
            },
            {
                "date": "2023-02-06",
                "value": 1.072935
            },
            {
                "date": "2023-07-12",
                "value": 1.114268
            },
            {
                "date": "2023-03-02",
                "value": 1.05994
            },
            {
                "date": "2023-05-18",
                "value": 1.077505
            },
            {
                "date": "2023-02-03",
                "value": 1.082778
            },
            {
                "date": "2023-04-19",
                "value": 1.095182
            },
            {
                "date": "2023-03-07",
                "value": 1.05493
            },
            {
                "date": "2023-06-13",
                "value": 1.0789
            },
            {
                "date": "2022-08-20",
                "value": 1.004182
            },
            {
                "date": "2023-02-24",
                "value": 1.058481
            },
            {
                "date": "2022-11-14",
                "value": 1.031891
            },
            {
                "date": "2023-03-20",
                "value": 1.07188
            },
            {
                "date": "2022-08-13",
                "value": 1.026352
            },
            {
                "date": "2022-08-25",
                "value": 0.997093
            },
            {
                "date": "2022-11-22",
                "value": 1.030954
            },
            {
                "date": "2022-11-15",
                "value": 1.035824
            },
            {
                "date": "2022-12-08",
                "value": 1.055853
            },
            {
                "date": "2022-10-01",
                "value": 0.980478
            },
            {
                "date": "2022-12-12",
                "value": 1.054141
            },
            {
                "date": "2022-09-30",
                "value": 0.980478
            },
            {
                "date": "2022-08-19",
                "value": 1.004182
            },
            {
                "date": "2023-01-17",
                "value": 1.078737
            },
            {
                "date": "2022-12-26",
                "value": 1.063988
            },
            {
                "date": "2022-12-17",
                "value": 1.059939
            },
            {
                "date": "2022-12-18",
                "value": 1.058403
            },
            {
                "date": "2022-07-27",
                "value": 1.020773
            },
            {
                "date": "2022-09-26",
                "value": 0.962232
            },
            {
                "date": "2022-12-01",
                "value": 1.052798
            },
            {
                "date": "2023-02-09",
                "value": 1.074056
            },
            {
                "date": "2023-04-13",
                "value": 1.105131
            },
            {
                "date": "2022-12-19",
                "value": 1.061348
            },
            {
                "date": "2023-05-17",
                "value": 1.083799
            },
            {
                "date": "2022-08-27",
                "value": 0.996561
            },
            {
                "date": "2023-01-20",
                "value": 1.087661
            },
            {
                "date": "2023-05-30",
                "value": 1.073134
            },
            {
                "date": "2022-09-27",
                "value": 0.959582
            },
            {
                "date": "2023-01-29",
                "value": 1.08711
            },
            {
                "date": "2023-01-25",
                "value": 1.092167
            },
            {
                "date": "2022-08-22",
                "value": 0.993912
            },
            {
                "date": "2022-12-07",
                "value": 1.051293
            },
            {
                "date": "2023-01-02",
                "value": 1.067737
            },
            {
                "date": "2023-04-16",
                "value": 1.098478
            },
            {
                "date": "2023-03-08",
                "value": 1.054952
            },
            {
                "date": "2023-05-12",
                "value": 1.093967
            },
            {
                "date": "2022-11-21",
                "value": 1.024333
            },
            {
                "date": "2022-07-22",
                "value": 1.021408
            },
            {
                "date": "2022-08-14",
                "value": 1.025483
            },
            {
                "date": "2022-12-04",
                "value": 1.054196
            },
            {
                "date": "2022-10-29",
                "value": 0.996462
            },
            {
                "date": "2023-01-28",
                "value": 1.087251
            },
            {
                "date": "2022-12-23",
                "value": 1.066548
            },
            {
                "date": "2022-12-06",
                "value": 1.04666
            }
        ] 
        //console.log("Historical prices")
       // console.log(historicalPrices)
      }, []);

    /*Historical prices*/
    const historicalPrices =[
        {
            "date": "2023-01-01",
            "value": 1.070452
        },
        {
            "date": "2023-04-15",
            "value": 1.110366
        },
        {
            "date": "2023-05-11",
            "value": 1.091179
        },
        {
            "date": "2023-01-26",
            "value": 1.089448
        },
        {
            "date": "2022-12-20",
            "value": 1.06253
        },
        {
            "date": "2022-07-21",
            "value": 1.022072
        },
        {
            "date": "2022-11-09",
            "value": 1.001445
        },
        {
            "date": "2022-07-24",
            "value": 1.019987
        },
        {
            "date": "2022-12-02",
            "value": 1.053685
        },
        {
            "date": "2022-12-25",
            "value": 1.066782
        },
        {
            "date": "2023-01-23",
            "value": 1.087217
        },
        {
            "date": "2023-03-29",
            "value": 1.084328
        },
        {
            "date": "2023-01-04",
            "value": 1.060839
        },
        {
            "date": "2023-04-10",
            "value": 1.086897
        },
        {
            "date": "2023-05-14",
            "value": 1.085234
        },
        {
            "date": "2023-02-27",
            "value": 1.060951
        },
        {
            "date": "2023-03-23",
            "value": 1.083517
        },
        {
            "date": "2023-07-14",
            "value": 1.124669
        },
        {
            "date": "2023-03-04",
            "value": 1.065019
        },
        {
            "date": "2023-06-10",
            "value": 1.076537
        },
        {
            "date": "2022-10-02",
            "value": 0.979235
        },
        {
            "date": "2022-11-06",
            "value": 0.993004
        },
        {
            "date": "2022-10-25",
            "value": 0.996338
        },
        {
            "date": "2022-09-14",
            "value": 0.998253
        },
        {
            "date": "2022-08-15",
            "value": 1.016162
        },
        {
            "date": "2022-09-11",
            "value": 1.007105
        },
        {
            "date": "2022-10-07",
            "value": 0.974013
        },
        {
            "date": "2022-11-03",
            "value": 0.974968
        },
        {
            "date": "2023-02-05",
            "value": 1.079051
        },
        {
            "date": "2023-07-11",
            "value": 1.10137
        },
        {
            "date": "2023-03-01",
            "value": 1.066906
        },
        {
            "date": "2023-06-15",
            "value": 1.094559
        },
        {
            "date": "2023-02-22",
            "value": 1.060556
        },
        {
            "date": "2023-03-26",
            "value": 1.07765
        },
        {
            "date": "2022-11-13",
            "value": 1.032818
        },
        {
            "date": "2022-10-17",
            "value": 0.984443
        },
        {
            "date": "2022-09-01",
            "value": 0.995198
        },
        {
            "date": "2022-10-30",
            "value": 0.995406
        },
        {
            "date": "2023-06-22",
            "value": 1.095768
        },
        {
            "date": "2023-04-28",
            "value": 1.112713
        },
        {
            "date": "2023-06-05",
            "value": 1.071145
        },
        {
            "date": "2023-03-11",
            "value": 1.065753
        },
        {
            "date": "2023-07-01",
            "value": 1.091643
        },
        {
            "date": "2023-02-15",
            "value": 1.069198
        },
        {
            "date": "2023-03-14",
            "value": 1.072729
        },
        {
            "date": "2023-07-04",
            "value": 1.088381
        },
        {
            "date": "2023-02-10",
            "value": 1.069919
        },
        {
            "date": "2023-05-29",
            "value": 1.070733
        },
        {
            "date": "2022-09-04",
            "value": 0.990908
        },
        {
            "date": "2022-07-19",
            "value": 1.023096
        },
        {
            "date": "2022-11-16",
            "value": 1.039426
        },
        {
            "date": "2022-10-12",
            "value": 0.970765
        },
        {
            "date": "2022-09-29",
            "value": 0.982922
        },
        {
            "date": "2022-10-18",
            "value": 0.986241
        },
        {
            "date": "2023-05-04",
            "value": 1.102256
        },
        {
            "date": "2023-01-14",
            "value": 1.084775
        },
        {
            "date": "2023-05-23",
            "value": 1.076936
        },
        {
            "date": "2023-04-27",
            "value": 1.103141
        },
        {
            "date": "2023-05-26",
            "value": 1.073134
        },
        {
            "date": "2023-04-22",
            "value": 1.10975
        },
        {
            "date": "2023-05-01",
            "value": 1.096851
        },
        {
            "date": "2023-04-05",
            "value": 1.090406
        },
        {
            "date": "2023-01-11",
            "value": 1.076414
        },
        {
            "date": "2022-11-19",
            "value": 1.03455
        },
        {
            "date": "2022-07-31",
            "value": 1.020668
        },
        {
            "date": "2022-12-30",
            "value": 1.072673
        },
        {
            "date": "2022-07-16",
            "value": 1.008695
        },
        {
            "date": "2023-01-13",
            "value": 1.084775
        },
        {
            "date": "2023-04-07",
            "value": 1.099621
        },
        {
            "date": "2023-03-19",
            "value": 1.067839
        },
        {
            "date": "2023-05-03",
            "value": 1.106856
        },
        {
            "date": "2023-04-20",
            "value": 1.096828
        },
        {
            "date": "2023-05-24",
            "value": 1.075558
        },
        {
            "date": "2022-09-09",
            "value": 1.015176
        },
        {
            "date": "2022-12-15",
            "value": 1.063886
        },
        {
            "date": "2022-12-10",
            "value": 1.054685
        },
        {
            "date": "2022-08-08",
            "value": 1.019727
        },
        {
            "date": "2023-04-25",
            "value": 1.097936
        },
        {
            "date": "2023-01-31",
            "value": 1.086106
        },
        {
            "date": "2023-05-21",
            "value": 1.082239
        },
        {
            "date": "2023-02-18",
            "value": 1.072036
        },
        {
            "date": "2023-04-02",
            "value": 1.080567
        },
        {
            "date": "2023-05-06",
            "value": 1.121026
        },
        {
            "date": "2023-06-25",
            "value": 1.090631
        },
        {
            "date": "2023-03-31",
            "value": 1.08707
        },
        {
            "date": "2023-02-12",
            "value": 1.067834
        },
        {
            "date": "2023-04-08",
            "value": 1.099621
        },
        {
            "date": "2023-03-16",
            "value": 1.061379
        },
        {
            "date": "2023-06-02",
            "value": 1.072558
        },
        {
            "date": "2022-10-10",
            "value": 0.970973
        },
        {
            "date": "2022-09-21",
            "value": 0.983038
        },
        {
            "date": "2022-08-02",
            "value": 1.015533
        },
        {
            "date": "2022-09-06",
            "value": 0.989761
        },
        {
            "date": "2022-08-07",
            "value": 1.017051
        },
        {
            "date": "2022-09-03",
            "value": 0.995768
        },
        {
            "date": "2022-10-15",
            "value": 0.972337
        },
        {
            "date": "2022-09-24",
            "value": 0.968964
        },
        {
            "date": "2023-02-17",
            "value": 1.071983
        },
        {
            "date": "2023-07-03",
            "value": 1.091274
        },
        {
            "date": "2023-03-13",
            "value": 1.072329
        },
        {
            "date": "2023-05-09",
            "value": 1.096431
        },
        {
            "date": "2023-06-20",
            "value": 1.092002
        },
        {
            "date": "2022-11-01",
            "value": 0.987884
        },
        {
            "date": "2022-07-29",
            "value": 1.022547
        },
        {
            "date": "2022-12-28",
            "value": 1.062869
        },
        {
            "date": "2022-08-17",
            "value": 1.017863
        },
        {
            "date": "2023-03-24",
            "value": 1.078046
        },
        {
            "date": "2023-06-30",
            "value": 1.091643
        },
        {
            "date": "2023-02-20",
            "value": 1.068319
        },
        {
            "date": "2023-05-19",
            "value": 1.082363
        },
        {
            "date": "2023-03-03",
            "value": 1.064917
        },
        {
            "date": "2023-07-13",
            "value": 1.12231
        },
        {
            "date": "2023-02-07",
            "value": 1.072938
        },
        {
            "date": "2023-06-12",
            "value": 1.076264
        },
        {
            "date": "2023-03-06",
            "value": 1.068661
        },
        {
            "date": "2023-04-18",
            "value": 1.097563
        },
        {
            "date": "2023-02-02",
            "value": 1.090477
        },
        {
            "date": "2023-03-21",
            "value": 1.077389
        },
        {
            "date": "2023-02-25",
            "value": 1.05842
        },
        {
            "date": "2022-11-23",
            "value": 1.041591
        },
        {
            "date": "2022-08-12",
            "value": 1.026352
        },
        {
            "date": "2022-11-04",
            "value": 0.998352
        },
        {
            "date": "2022-12-27",
            "value": 1.063683
        },
        {
            "date": "2022-08-18",
            "value": 1.008954
        },
        {
            "date": "2022-07-26",
            "value": 1.01292
        },
        {
            "date": "2023-05-16",
            "value": 1.086532
        },
        {
            "date": "2023-04-12",
            "value": 1.099699
        },
        {
            "date": "2023-02-08",
            "value": 1.071639
        },
        {
            "date": "2023-05-31",
            "value": 1.069347
        },
        {
            "date": "2023-01-21",
            "value": 1.087725
        },
        {
            "date": "2023-01-24",
            "value": 1.088779
        },
        {
            "date": "2023-04-30",
            "value": 1.101055
        },
        {
            "date": "2023-05-13",
            "value": 1.093967
        },
        {
            "date": "2023-03-09",
            "value": 1.058436
        },
        {
            "date": "2023-04-17",
            "value": 1.092502
        },
        {
            "date": "2023-01-03",
            "value": 1.054652
        },
        {
            "date": "2022-12-05",
            "value": 1.049659
        },
        {
            "date": "2022-07-23",
            "value": 1.021408
        },
        {
            "date": "2022-12-22",
            "value": 1.060165
        },
        {
            "date": "2022-10-28",
            "value": 0.996462
        },
        {
            "date": "2023-05-10",
            "value": 1.09837
        },
        {
            "date": "2023-04-14",
            "value": 1.110366
        },
        {
            "date": "2023-01-27",
            "value": 1.087251
        },
        {
            "date": "2022-12-21",
            "value": 1.060839
        },
        {
            "date": "2022-11-08",
            "value": 1.007927
        },
        {
            "date": "2022-07-20",
            "value": 1.018242
        },
        {
            "date": "2022-12-03",
            "value": 1.054085
        },
        {
            "date": "2022-07-25",
            "value": 1.022338
        },
        {
            "date": "2022-12-24",
            "value": 1.066776
        },
        {
            "date": "2023-03-28",
            "value": 1.083823
        },
        {
            "date": "2023-01-22",
            "value": 1.086461
        },
        {
            "date": "2023-05-15",
            "value": 1.087335
        },
        {
            "date": "2023-04-11",
            "value": 1.091716
        },
        {
            "date": "2023-01-05",
            "value": 1.052192
        },
        {
            "date": "2023-03-22",
            "value": 1.087004
        },
        {
            "date": "2023-02-26",
            "value": 1.055431
        },
        {
            "date": "2023-06-11",
            "value": 1.075061
        },
        {
            "date": "2023-03-05",
            "value": 1.062631
        },
        {
            "date": "2023-02-01",
            "value": 1.101248
        },
        {
            "date": "2022-11-07",
            "value": 1.001828
        },
        {
            "date": "2022-10-03",
            "value": 0.983173
        },
        {
            "date": "2022-09-15",
            "value": 0.998796
        },
        {
            "date": "2022-10-24",
            "value": 0.988616
        },
        {
            "date": "2022-09-10",
            "value": 1.015383
        },
        {
            "date": "2022-10-21",
            "value": 0.986144
        },
        {
            "date": "2022-11-02",
            "value": 0.981619
        },
        {
            "date": "2022-10-06",
            "value": 0.978871
        },
        {
            "date": "2023-06-14",
            "value": 1.08427
        },
        {
            "date": "2023-07-10",
            "value": 1.100558
        },
        {
            "date": "2023-02-04",
            "value": 1.082778
        },
        {
            "date": "2023-03-27",
            "value": 1.080672
        },
        {
            "date": "2023-02-23",
            "value": 1.059828
        },
        {
            "date": "2022-11-25",
            "value": 1.041445
        },
        {
            "date": "2023-07-09",
            "value": 1.096853
        },
        {
            "date": "2022-10-16",
            "value": 0.973904
        },
        {
            "date": "2023-07-08",
            "value": 1.097449
        },
        {
            "date": "2022-11-12",
            "value": 1.03729
        },
        {
            "date": "2022-10-31",
            "value": 0.988665
        },
        {
            "date": "2023-07-07",
            "value": 1.097449
        },
        {
            "date": "2023-07-06",
            "value": 1.089028
        },
        {
            "date": "2023-06-27",
            "value": 1.095686
        },
        {
            "date": "2023-04-29",
            "value": 1.112713
        },
        {
            "date": "2022-11-10",
            "value": 1.01942
        },
        {
            "date": "2023-06-23",
            "value": 1.09313
        },
        {
            "date": "2023-06-29",
            "value": 1.086767
        },
        {
            "date": "2023-02-14",
            "value": 1.073503
        },
        {
            "date": "2023-06-28",
            "value": 1.091548
        },
        {
            "date": "2023-03-10",
            "value": 1.065753
        },
        {
            "date": "2023-06-04",
            "value": 1.069745
        },
        {
            "date": "2023-02-11",
            "value": 1.070148
        },
        {
            "date": "2023-07-05",
            "value": 1.08554
        },
        {
            "date": "2023-03-15",
            "value": 1.058301
        },
        {
            "date": "2023-06-01",
            "value": 1.076044
        },
        {
            "date": "2023-06-26",
            "value": 1.091012
        },
        {
            "date": "2022-10-08",
            "value": 0.974013
        },
        {
            "date": "2023-05-28",
            "value": 1.072268
        },
        {
            "date": "2023-01-18",
            "value": 1.079727
        },
        {
            "date": "2022-08-01",
            "value": 1.026099
        },
        {
            "date": "2023-06-19",
            "value": 1.092395
        },
        {
            "date": "2022-11-30",
            "value": 1.042372
        },
        {
            "date": "2023-06-18",
            "value": 1.094032
        },
        {
            "date": "2023-06-17",
            "value": 1.09607
        },
        {
            "date": "2022-10-13",
            "value": 0.974943
        },
        {
            "date": "2023-06-16",
            "value": 1.09607
        },
        {
            "date": "2022-09-22",
            "value": 0.98401
        },
        {
            "date": "2022-08-21",
            "value": 1.003487
        },
        {
            "date": "2023-06-09",
            "value": 1.076537
        },
        {
            "date": "2023-06-08",
            "value": 1.078237
        },
        {
            "date": "2023-06-07",
            "value": 1.070709
        },
        {
            "date": "2023-06-06",
            "value": 1.06977
        },
        {
            "date": "2022-10-19",
            "value": 0.976615
        },
        {
            "date": "2022-11-28",
            "value": 1.034313
        },
        {
            "date": "2022-09-28",
            "value": 0.970784
        },
        {
            "date": "2023-01-15",
            "value": 1.082427
        },
        {
            "date": "2023-04-01",
            "value": 1.08707
        },
        {
            "date": "2022-07-30",
            "value": 1.022547
        },
        {
            "date": "2023-05-05",
            "value": 1.121026
        },
        {
            "date": "2023-04-26",
            "value": 1.104496
        },
        {
            "date": "2022-11-27",
            "value": 1.036683
        },
        {
            "date": "2023-05-22",
            "value": 1.08107
        },
        {
            "date": "2022-08-23",
            "value": 0.996656
        },
        {
            "date": "2023-04-23",
            "value": 1.099191
        },
        {
            "date": "2022-08-28",
            "value": 0.993833
        },
        {
            "date": "2023-05-27",
            "value": 1.073134
        },
        {
            "date": "2022-12-16",
            "value": 1.059714
        },
        {
            "date": "2023-01-10",
            "value": 1.07386
        },
        {
            "date": "2023-04-04",
            "value": 1.09583
        },
        {
            "date": "2022-11-20",
            "value": 1.033053
        },
        {
            "date": "2022-08-24",
            "value": 0.99676
        },
        {
            "date": "2023-01-06",
            "value": 1.066382
        },
        {
            "date": "2022-08-29",
            "value": 1.001252
        },
        {
            "date": "2023-01-19",
            "value": 1.083506
        },
        {
            "date": "2022-11-18",
            "value": 1.03455
        },
        {
            "date": "2022-07-17",
            "value": 1.009589
        },
        {
            "date": "2022-10-09",
            "value": 0.973468
        },
        {
            "date": "2022-12-31",
            "value": 1.072673
        },
        {
            "date": "2022-10-04",
            "value": 0.998398
        },
        {
            "date": "2023-05-02",
            "value": 1.101055
        },
        {
            "date": "2023-03-18",
            "value": 1.075211
        },
        {
            "date": "2023-04-06",
            "value": 1.091977
        },
        {
            "date": "2023-01-12",
            "value": 1.085977
        },
        {
            "date": "2022-11-17",
            "value": 1.036135
        },
        {
            "date": "2023-05-25",
            "value": 1.07241
        },
        {
            "date": "2022-11-29",
            "value": 1.032199
        },
        {
            "date": "2023-04-21",
            "value": 1.10975
        },
        {
            "date": "2023-01-07",
            "value": 1.066382
        },
        {
            "date": "2022-09-08",
            "value": 1.001051
        },
        {
            "date": "2022-09-18",
            "value": 1.002115
        },
        {
            "date": "2022-07-15",
            "value": 1.008695
        },
        {
            "date": "2022-12-14",
            "value": 1.067634
        },
        {
            "date": "2022-09-19",
            "value": 1.00245
        },
        {
            "date": "2022-10-20",
            "value": 0.977856
        },
        {
            "date": "2023-02-28",
            "value": 1.057686
        },
        {
            "date": "2022-12-11",
            "value": 1.052177
        },
        {
            "date": "2022-08-11",
            "value": 1.031513
        },
        {
            "date": "2022-09-05",
            "value": 0.995074
        },
        {
            "date": "2022-08-10",
            "value": 1.029919
        },
        {
            "date": "2022-07-28",
            "value": 1.019197
        },
        {
            "date": "2022-07-18",
            "value": 1.014482
        },
        {
            "date": "2022-08-04",
            "value": 1.024742
        },
        {
            "date": "2022-08-09",
            "value": 1.020778
        },
        {
            "date": "2022-08-05",
            "value": 1.018024
        },
        {
            "date": "2023-05-20",
            "value": 1.082363
        },
        {
            "date": "2023-01-30",
            "value": 1.084945
        },
        {
            "date": "2023-04-24",
            "value": 1.105767
        },
        {
            "date": "2023-05-07",
            "value": 1.101831
        },
        {
            "date": "2022-10-05",
            "value": 0.991066
        },
        {
            "date": "2023-04-03",
            "value": 1.091048
        },
        {
            "date": "2023-02-19",
            "value": 1.068492
        },
        {
            "date": "2023-03-30",
            "value": 1.090441
        },
        {
            "date": "2023-06-24",
            "value": 1.09313
        },
        {
            "date": "2023-01-16",
            "value": 1.082978
        },
        {
            "date": "2022-09-23",
            "value": 0.968964
        },
        {
            "date": "2023-06-03",
            "value": 1.072558
        },
        {
            "date": "2023-03-17",
            "value": 1.075211
        },
        {
            "date": "2023-04-09",
            "value": 1.091239
        },
        {
            "date": "2023-02-13",
            "value": 1.073008
        },
        {
            "date": "2022-09-20",
            "value": 0.997044
        },
        {
            "date": "2022-12-13",
            "value": 1.062632
        },
        {
            "date": "2022-10-11",
            "value": 0.969984
        },
        {
            "date": "2022-11-05",
            "value": 0.998352
        },
        {
            "date": "2022-08-26",
            "value": 0.996561
        },
        {
            "date": "2022-09-07",
            "value": 0.999535
        },
        {
            "date": "2022-12-09",
            "value": 1.054736
        },
        {
            "date": "2022-08-03",
            "value": 1.015729
        },
        {
            "date": "2022-10-27",
            "value": 0.996746
        },
        {
            "date": "2022-09-02",
            "value": 0.995768
        },
        {
            "date": "2022-09-17",
            "value": 1.00163
        },
        {
            "date": "2022-08-06",
            "value": 1.018024
        },
        {
            "date": "2022-09-25",
            "value": 0.968851
        },
        {
            "date": "2022-09-16",
            "value": 1.001532
        },
        {
            "date": "2022-10-14",
            "value": 0.972337
        },
        {
            "date": "2022-10-26",
            "value": 1.009158
        },
        {
            "date": "2023-05-08",
            "value": 1.099578
        },
        {
            "date": "2023-03-12",
            "value": 1.068331
        },
        {
            "date": "2023-07-02",
            "value": 1.090633
        },
        {
            "date": "2023-02-16",
            "value": 1.066555
        },
        {
            "date": "2022-11-11",
            "value": 1.037183
        },
        {
            "date": "2023-06-21",
            "value": 1.099139
        },
        {
            "date": "2023-01-09",
            "value": 1.073445
        },
        {
            "date": "2022-11-26",
            "value": 1.041445
        },
        {
            "date": "2023-01-08",
            "value": 1.065598
        },
        {
            "date": "2022-08-31",
            "value": 1.00387
        },
        {
            "date": "2022-11-24",
            "value": 1.040778
        },
        {
            "date": "2022-10-23",
            "value": 0.98595
        },
        {
            "date": "2022-08-16",
            "value": 1.01703
        },
        {
            "date": "2022-10-22",
            "value": 0.986144
        },
        {
            "date": "2022-12-29",
            "value": 1.066155
        },
        {
            "date": "2022-09-12",
            "value": 1.01292
        },
        {
            "date": "2022-09-13",
            "value": 0.998054
        },
        {
            "date": "2023-02-21",
            "value": 1.065167
        },
        {
            "date": "2022-08-30",
            "value": 1.002471
        },
        {
            "date": "2023-03-25",
            "value": 1.078162
        },
        {
            "date": "2023-02-06",
            "value": 1.072935
        },
        {
            "date": "2023-07-12",
            "value": 1.114268
        },
        {
            "date": "2023-03-02",
            "value": 1.05994
        },
        {
            "date": "2023-05-18",
            "value": 1.077505
        },
        {
            "date": "2023-02-03",
            "value": 1.082778
        },
        {
            "date": "2023-04-19",
            "value": 1.095182
        },
        {
            "date": "2023-03-07",
            "value": 1.05493
        },
        {
            "date": "2023-06-13",
            "value": 1.0789
        },
        {
            "date": "2022-08-20",
            "value": 1.004182
        },
        {
            "date": "2023-02-24",
            "value": 1.058481
        },
        {
            "date": "2022-11-14",
            "value": 1.031891
        },
        {
            "date": "2023-03-20",
            "value": 1.07188
        },
        {
            "date": "2022-08-13",
            "value": 1.026352
        },
        {
            "date": "2022-08-25",
            "value": 0.997093
        },
        {
            "date": "2022-11-22",
            "value": 1.030954
        },
        {
            "date": "2022-11-15",
            "value": 1.035824
        },
        {
            "date": "2022-12-08",
            "value": 1.055853
        },
        {
            "date": "2022-10-01",
            "value": 0.980478
        },
        {
            "date": "2022-12-12",
            "value": 1.054141
        },
        {
            "date": "2022-09-30",
            "value": 0.980478
        },
        {
            "date": "2022-08-19",
            "value": 1.004182
        },
        {
            "date": "2023-01-17",
            "value": 1.078737
        },
        {
            "date": "2022-12-26",
            "value": 1.063988
        },
        {
            "date": "2022-12-17",
            "value": 1.059939
        },
        {
            "date": "2022-12-18",
            "value": 1.058403
        },
        {
            "date": "2022-07-27",
            "value": 1.020773
        },
        {
            "date": "2022-09-26",
            "value": 0.962232
        },
        {
            "date": "2022-12-01",
            "value": 1.052798
        },
        {
            "date": "2023-02-09",
            "value": 1.074056
        },
        {
            "date": "2023-04-13",
            "value": 1.105131
        },
        {
            "date": "2022-12-19",
            "value": 1.061348
        },
        {
            "date": "2023-05-17",
            "value": 1.083799
        },
        {
            "date": "2022-08-27",
            "value": 0.996561
        },
        {
            "date": "2023-01-20",
            "value": 1.087661
        },
        {
            "date": "2023-05-30",
            "value": 1.073134
        },
        {
            "date": "2022-09-27",
            "value": 0.959582
        },
        {
            "date": "2023-01-29",
            "value": 1.08711
        },
        {
            "date": "2023-01-25",
            "value": 1.092167
        },
        {
            "date": "2022-08-22",
            "value": 0.993912
        },
        {
            "date": "2022-12-07",
            "value": 1.051293
        },
        {
            "date": "2023-01-02",
            "value": 1.067737
        },
        {
            "date": "2023-04-16",
            "value": 1.098478
        },
        {
            "date": "2023-03-08",
            "value": 1.054952
        },
        {
            "date": "2023-05-12",
            "value": 1.093967
        },
        {
            "date": "2022-11-21",
            "value": 1.024333
        },
        {
            "date": "2022-07-22",
            "value": 1.021408
        },
        {
            "date": "2022-08-14",
            "value": 1.025483
        },
        {
            "date": "2022-12-04",
            "value": 1.054196
        },
        {
            "date": "2022-10-29",
            "value": 0.996462
        },
        {
            "date": "2023-01-28",
            "value": 1.087251
        },
        {
            "date": "2022-12-23",
            "value": 1.066548
        },
        {
            "date": "2022-12-06",
            "value": 1.04666
        }
    ]
    
    

    /* Currency List */
    const currencyList = [
        "AUD - Australian Dollar",
        "CAD - Canadian Dollar",
        "CHF - Swiss Franc",
        "CNY - Chinese Yuan",
        "EUR - Euro",
        "GBP - British Pound Sterling",
        "HKD - Hong Kong Dollar",
        "JPY - Japanese Yen",
        "NOK - Norwegian Krone",
        "NZD - New Zealand Dollar",
        "RUB - Russian Ruble",
        "SEK - Swedish Krona",
        "SGD - Singapore Dollar",
        "TRY - Turkish Lira",
        "USD - United States Dollar",
        "ZAR - South African Rand"
        ];

    const currencyTable = {
        AUD: "AUD - Australian Dollar",
        BRL: "BRL - Brazilian Real",
        CAD: "CAD - Canadian Dollar",
        CHF: "CHF - Swiss Franc",
        CNY: "CNY - Chinese Yuan",
        EUR: "Eur - Euro",
        GBP: "GBP- British Pound Sterling",
        HKD: "HKD - Hong Kong Dollar",
        INR: "INR - Indian Rupee",
        JPY: "JPY - Japanese Yen",
        KRW: "KRW - South Korean Won",
        MXN: "MXN - Mexican Peso",
        NOK: "NOK - Norwegian Krone",
        NZD: "NZD - New Zealand Dollar",
        RUB: "RUB - Russian Ruble",
        SEK: "SEK - Swedish Krona",
        SGD: "SGD - Singaporre Dollar",
        TRY: "TRY - Turkish Lira",
        USD: "USD - United States Dollar",
        ZAR: "ZAR - South African Rand "

    }
    //get symbol of currency
    function getKeyByValue(object, currency){
        return Object.keys(object).find(key =>object[key] ===currency)//https://www.geeksforgeeks.org/how-to-get-a-key-in-a-javascript-object-by-its-value/
    }
    
      
    
    //
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
        setpriceCurrencySymbol(getKeyByValue(currencyTable,e.target.value))
        getTimeSeriesData();

        

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