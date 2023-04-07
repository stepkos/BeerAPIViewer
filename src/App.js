import React, { useState, useEffect } from 'react';
import './App.css';
import BeerList from './compontents/BeerList';
import FilterForm from './compontents/FilterForm';

function App() {

    const [beers, setBeers] = useState([]);
    const [likedBeersId, setLikedBeersId] = useState(() => {
        const storedList = localStorage.getItem('likedBeersId');
        return storedList ? JSON.parse(storedList) : [];
    });
    const [filteredBeers, setFilteredBeers] = useState([]);
    const [searchInput, setSearchInput] = useState('');
    const [displayOnlyLiked, setDisplayOnlyLiked] = useState(false);
    
    // Fetch beers from API
    useEffect(() => {
        const fetchAPI = async () => {
          const data = await fetch("https://api.punkapi.com/v2/beers?page=1&per_page=50");
          const beerList = await data.json();
          setBeers(beerList);
        };
        fetchAPI();
    }, []);

    // Update filteredBeers
    useEffect(() => {
        let beersToDisplay = [...beers];
        
        // Add is_liked to beer object
        beersToDisplay.forEach(beer => beer.is_liked = likedBeersId.includes(beer.id));

        // Display only liked
        if (displayOnlyLiked)
            beersToDisplay = beersToDisplay.filter(beer => beer.is_liked);

        // Filter by name
        if (searchInput !== '')
            beersToDisplay = beersToDisplay.filter(beer => 
                beer.name.toLocaleLowerCase().includes(searchInput.toLocaleLowerCase()));
        
        setFilteredBeers(beersToDisplay);
    }, [beers, searchInput, likedBeersId, displayOnlyLiked]);
    
    // Save likedBeersId to local storage
    useEffect(() => {
        localStorage.setItem('likedBeersId', JSON.stringify(likedBeersId));
    }, [likedBeersId])

    const toogleLike = id => {
        if (likedBeersId.includes(id))
            setLikedBeersId(likedBeersId.filter(el => el !== id));
        else
            setLikedBeersId([...likedBeersId, id]);
    }

    return (<>
        <FilterForm 
            searchInput={searchInput} 
            setSearchInput={setSearchInput} 
            displayOnlyLiked={displayOnlyLiked}
            setDisplayOnlyLiked={setDisplayOnlyLiked}
        />
        <BeerList beers={filteredBeers} toogleLike={toogleLike} />
    </>);
}

export default App;
