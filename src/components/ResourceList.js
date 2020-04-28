import React, {useState, useEffect} from 'react';
import useResources from './useResource';

const ResourceList = ({filter,search}) => {
    const [favoriteList, setFavoriteList] = useState([]);
    const [favoriteItem, setFavoriteItem] = useState();
    const [sort, setSort] = useState({sorttingBasis: '', counter: 0});
    const [sortedList, setSortedList] = useState([]);
    let resources = useResources(filter, search, favoriteList);

    useEffect(() => {
        if(favoriteItem === '' || favoriteItem === undefined) {
            return
        }
        registFavorite();
    },[favoriteItem])

    useEffect(() => {
        setFavoriteItem();
    },[favoriteList])

    useEffect(() => {
        setSortedList(resources);
    },[resources])

    useEffect(() => {
        setSortedList(sorting(resources));
    },[sort, resources])

    const ratioColor = (number) => {
        if(number>0) return 'green';
        if(number===0) return 'white'
        if(number<0) return 'red'
    }

    const localeString = (number) => {
        return number.toLocaleString();
    }

    const localeUnit = (totalPrice, name) => {
        const unit = name.substring(name.length-3, name.length);
        const totalPriceLength = totalPrice.length;
        return totalPriceLength > 9 ? totalPrice.substring(0, totalPriceLength-9) + "억 " +unit
            : totalPriceLength > 5 ? totalPrice.substring(0, totalPriceLength-5) + "만 " + unit
            : totalPrice + " " +unit
    }

    const registFavorite = () => {
        setFavoriteList([...favoriteList, favoriteItem]);
        const index = favoriteList.findIndex(el => el.name === favoriteItem.name);
         
        if(index !== -1) {
            let tempList = [...favoriteList];
            tempList.splice(index,1);
            setFavoriteList([...tempList]);
        } else {
            setFavoriteList([...favoriteList, favoriteItem]);
        }
    }

    const sortSetter = (basis) => {
        let {counter} = sort;
        const check = sort.sorttingBasis === basis;
        if ( !check ) {
            return setSort({
                ...sort,
                sorttingBasis: basis,
                counter: 0
            }); 
        }
        if(check && counter < 1){
            return setSort({
                ...sort,
                counter: counter +=1
            })
        }
        if(check && counter >= 1 ) {
            return setSort({
                sorttingBasis: '', counter: 0
            })
        }
    }

    const sorting = (resource) => {
        const {sorttingBasis, counter} = sort;
        let tempList = [...resource];
        if(sorttingBasis === '') {
            return resource
        } else {
            return tempList.sort((a,b) => {
                if(counter === 0) {
                    return sorttingBasis === 'name' ? ('' + a.title.name).localeCompare(b.title.name) : a[sorttingBasis]-b[sorttingBasis]
                } else if (counter === 1) {
                    return sorttingBasis === 'name' ? ('' + b.title.name).localeCompare(a.title.name) : b[sorttingBasis]-a[sorttingBasis]
                }
            })
        }
        
    }

    const tableHeader = (head, atrribute) => {
        return (
            <th>{head} <i className="fa fa-arrows-v" aria-hidden="true" onClick={() => sortSetter(atrribute)} style={{cursor: 'pointer'}}></i></th>
        )
    }

    const favoriteBoxChecker = (record) => {
        const index = favoriteList.findIndex(el => el.name === record.name);
        return index === -1 ? false : true
    }

    return(
        <table className="table table-dark">
            <thead>
                <tr>
                    <th></th>
                    {tableHeader('이름', 'name')}
                    {tableHeader('현재가', 'close')}
                    {tableHeader('변동', 'ratio')}
                    {tableHeader('최저가', 'low')}
                    {tableHeader('최고가', 'high')}
                    {tableHeader('거래대금', 'totalPrice')}
                </tr>
            </thead>
            <tbody>
                {sortedList.map(record => (
                    <tr key={record.name}>
                        <th>
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" defaultChecked={favoriteBoxChecker(record)} onClick={() => setFavoriteItem(record)}/>
                            </div>    
                        </th>
                        <th>{record.title.name} <br></br>{record.name}</th>
                        <th>{localeString(record.close)} <br></br> {record.exchange ? record.exchange + 'KRW' : ''}</th>
                        <th style={{ color: ratioColor(record.ratio) }}>
                            {record.ratio}%
                        </th>
                        <th>{localeString(record.low)}</th>
                        <th>{localeString(record.high)}</th>
                        <th>{localeUnit(record.totalPrice, record.name)}</th>
                    </tr>
                ))}
            </tbody>
        </table >
        )
}

export default ResourceList;