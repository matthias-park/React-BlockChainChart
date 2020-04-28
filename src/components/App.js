import React, { useState } from 'react';
import ResourceList from './ResourceList';

const App = () => {
    const [filter, setfilter] = useState('KRW');
    const [search, setSearch] = useState('');

    const searchHandler = (e) => {
        const {value} = e.target;
        setSearch(value.toUpperCase())
    }

    return (
        <div>
            <div className="btn-group" role="group" aria-label="Basic example">
                <button type="button" className="btn btn-secondary" onClick={() => setfilter('favorite')} >관심</button>
                <button type="button" className="btn btn-secondary" onClick={() => setfilter('KRW')}>KRW</button>
                <button type="button" className="btn btn-secondary" onClick={() => setfilter('BTC')}>BTC</button>
                <button type="button" className="btn btn-secondary" onClick={() => setfilter('ETH')}>ETH</button>
            </div>
            <div>
                <input type="text" className="form-control" id="search" placeholder="이름/심볼 검색" onChange={searchHandler} />
            </div>
            <ResourceList filter={filter} search={search}/>
        </div>
    );
}

export default App;