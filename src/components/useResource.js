import { useState, useEffect } from 'react';
import axios from 'axios';

const useResources = (filter, search, favoriteList, sort) => {
    const [resources, setResources] = useState([]);
    const [filteredData, setFilteredData] = useState([]);

    const fetchData = async () => {
        const request1 = axios.get('/assets');
        const request2 = axios.get("/trading-pairs/stats");
        await axios.all([request1, request2]).then(axios.spread((...responses) => {
            const priceBTCbyKRW = responses[1].data.find(record => record.name === 'BTC-KRW');
            const priceETHbyKRW = responses[1].data.find(record => record.name === 'ETH-KRW');
            const response1 = responses[0].data;
            const response2 = responses[1].data.map(el => {
                const criteriaWord = el.name.substr(0, el.name.indexOf('-'));
                const baseToken = el.name.substring(el.name.length-3, el.name.length);
                el.title = response1.find(name => name.id === criteriaWord);
                el.ratio = calcRatio(el.close, el.open);
                el.totalPrice = calcTotalPrice(el.close, el.volume, el.name);
                if(baseToken === 'BTC'){
                    el.exchange = Math.round(el.close * priceBTCbyKRW.close)
                }
                if(baseToken === 'ETH'){
                    el.exchange = Math.round(el.close * priceETHbyKRW.close)
                }
                return el;
            })
            setResources(response2);
        })).catch(error=> {
            console.error(error);
        })
    }

    const filterData = (resource) => {
        const result = resource.filter(el => {
            const criteriaWord = el.name.substring(el.name.length-3, el.name.length);
                return criteriaWord === filter;
        })
        // console.log(result);
        return searchData(result);
    }

    const searchData = (resource) => {
        const result = resource.filter(el => {
            if(search !== '') {
                return el.title.id.includes(search);
            } else {
                return true;
            }
        })
        return result;
    }

    const calcRatio = (close, open) => {
        return ((close - open) / close * 100).toFixed(2)
    }

    const calcTotalPrice = (price, volume, name) => {
        const totalPrice =  Math.round(price * volume).toString();
        return totalPrice
    }

    useEffect(() => {
        fetchData();
        const interval = setInterval(() => {
           fetchData();
        }, 1000*60)
        return () => clearInterval(interval)
      },[]);

    useEffect(() => {
        if(filter === 'favorite') {
            setFilteredData(searchData(favoriteList));
        } else {
            setFilteredData(filterData(resources));
        }
    },[filter, search, resources, favoriteList])

    return filteredData;
}
export default useResources;