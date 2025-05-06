import { useEffect, useState } from 'react';
import DogCard from '../DogCard/DogCard';
import searchTheDogApi from '../../Utils/TheDogApi';
import './DogList.css';

function DogList({ dogCards }) {
  const [breedFacts, setBreedFacts] = useState({});

  // Utility function to clean up breed names
  const normalizeBreed = (name) => {
    return name?.toLowerCase().replace(/[^a-z ]/gi, "").trim();
  };

  useEffect(() => {
    const fetchAllFacts = async () => {
      const newFacts = {};
      for (const dog of dogCards) {
        const rawBreed = dog.breeds?.primary;
        const breed = normalizeBreed(rawBreed);

        if (breed && !newFacts[breed]) {
          const fact = await searchTheDogApi(breed);
          newFacts[breed] = fact;
        }
      }
      setBreedFacts(newFacts);
    };

    fetchAllFacts();
  }, [dogCards]);

  return (
    <div className="list-container">
      {dogCards.map((dog) => {
        const rawBreed = dog.breeds?.primary;
        const breed = normalizeBreed(rawBreed);
        return (
          <DogCard
            key={dog.id || dog.name}
            dog={dog}
            fact={breedFacts[breed] || ""}
          />
        );
      })}
    </div>
  );
}

export default DogList;
