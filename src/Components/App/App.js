import './App.css';
import { useState, useEffect } from 'react';

import searchTheDogApi from '../../Utils/TheDogApi';
import searchPetFinder from '../../Utils/PetFinder';

import SearchBar from '../SearchBar/SearchBar';
import DogList from '../DogList/DogList';

import { authenticate } from '../../Utils/PetFinder';

function App() {
  const [dogCards, setDogCard] = useState([]);
  const [breedFacts, setBreedFacts] = useState({});
  const [breeds, setBreeds] = useState([]);

  const search = async (term, age, size, breed) => {
    const searchResults = await searchPetFinder(term, age, size, breed);



    const dogsWithPhotos = searchResults.filter(dog =>
        dog.photos &&
        dog.photos.length > 0 &&
        dog.photos[0] &&
        typeof dog.photos[0].medium === 'string' &&
        dog.photos[0].medium !== "https://placedog.net/500" &&
        dog.description &&
        dog.description.trim().split(' ').length >= 5
      );
      
      
    
    const uniqueDogs = [];
    const seenIds = new Set();
    
    for (const dog of dogsWithPhotos) {
      if (!seenIds.has(dog.id)) {
        uniqueDogs.push(dog);
        seenIds.add(dog.id);
      }
    }

    const facts = {};
    for (const dog of uniqueDogs) {
      if (dog.breeds?.primary && !facts[dog.breeds.primary]) {
        facts[dog.breeds.primary] = await searchTheDogApi(dog.breeds.primary);
      }
    }

    setDogCard(uniqueDogs);
    setBreedFacts(facts);
  };

  useEffect(() => {
    search("", "", "", "");  
  }, []); 

  useEffect(() => {
    const fetchBreeds = async () => {
      try {
        const token = await authenticate();
        const response = await fetch("https://api.petfinder.com/v2/types/dog/breeds", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
  
        if (!response.ok) {
          throw new Error(`Failed to fetch breeds: ${response.status}`);
        }
  
        const data = await response.json();
        const breedList = data.breeds.map(breed => breed.name);
        setBreeds(breedList);
      } catch (error) {
        console.error("Breed fetch error:", error);
      }
    };
  
    fetchBreeds();
  }, []);

  return (
    <main>
      <SearchBar search={search} breeds={breeds} />
      <DogList dogCards={dogCards} breedFacts={breedFacts} />
    </main>
  );
}

export default App;
