import React, {useState, useEffect} from 'react';
import useResources from './useResource';

const ResourceList = ({filter,search}) => {
    const [favoriteList, setFavoriteList] = useState([]);
    const [favoriteItem, setFavoriteItem] = useState();
    const [sort, setSort] = useState('');
    let resources = useResources(filter, search, favoriteList, sort);

    useEffect(() => {
        if(favoriteItem === '' || favoriteItem === undefined) {
            return
        }
        registFavorite();
    },[favoriteItem])

    useEffect(() => {
        setFavoriteItem();
    },[favoriteList])


    const calcTotalPrice = (price, volume, name) => {
        const totalPrice =  Math.round(price * volume).toString();
        const unit = name.substring(name.length-3, name.length);
        const totalPriceLength = totalPrice.length;
        return totalPriceLength > 9 ? totalPrice.substring(0, totalPriceLength-9) + "억 " +unit
            : totalPriceLength > 5 ? totalPrice.substring(0, totalPriceLength-5) + "만 " + unit
            : totalPrice + " " +unit
    }

    const calcRatio = (close, open) => {
        return ((close - open) / close * 100).toFixed(2)
    }

    const ratioColor = (number) => {
        if(number>0) return 'green';
        if(number===0) return 'white'
        if(number<0) return 'red'
    }

    const localeString = (number) => {
        return number.toLocaleString();
    }

    const registFavorite = () => {
        setFavoriteList([...favoriteList, favoriteItem]);
        const index = favoriteList.findIndex(el => el.name === favoriteItem.name);
         
        if(index !== -1) {
            let tempList = favoriteList;
            tempList.splice(index,1);
            setFavoriteList([...tempList]);
        } else {
            setFavoriteList([...favoriteList, favoriteItem]);
        }
    }

    return(
        <table className="table table-dark">
            <thead>
                <tr>
                    <th></th>
                    <th>이름 <i className="fa fa-arrows-v" aria-hidden="true" onClick={() => setSort('name')}></i></th>
                    <th>현재가 <i className="fa fa-arrows-v" aria-hidden="true" onClick={() => setSort('close')}></i></th>
                    <th>변동 <i className="fa fa-arrows-v" aria-hidden="true" onClick={() => setSort('name')}></i></th>
                    <th>최저가 <i className="fa fa-arrows-v" aria-hidden="true" onClick={() => setSort('name')}></i></th>
                    <th>최고가 <i className="fa fa-arrows-v" aria-hidden="true" onClick={() => setSort('name')}></i></th>
                    <th>거래대금 <i className="fa fa-arrows-v" aria-hidden="true" onClick={() => setSort('name')}></i></th>
                </tr>
            </thead>
            <tbody>
                {resources.map(record => (
                    <tr key={record.name}>
                        <th>
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" onClick={() => setFavoriteItem(record)}/>
                            </div>    
                        </th>
                        <th>{record.title.name} <br></br>{record.name}</th>
                        <th>{localeString(record.close)} <br></br> {record.exchange ? record.exchange + 'KRW' : ''}</th>
                        <th style={{ color: ratioColor(calcRatio(record.close, record.open)) }}>
                            {calcRatio(record.close, record.open)}%
                        </th>
                        <th>{localeString(record.low)}</th>
                        <th>{localeString(record.high)}</th>
                        <th>{calcTotalPrice(record.close, record.volume, record.name)}</th>
                    </tr>
                ))}
            </tbody>
        </table >
        )
}

export default ResourceList;