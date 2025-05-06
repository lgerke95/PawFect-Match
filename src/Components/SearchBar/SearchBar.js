import './SearchBar.css';
import logo from '../../Images/pawfect match logo.png';
import { useState } from 'react';
import searchicon from '../../Images/searchicon.png';


function SearchBar({ search, breeds }) {
  const [term, setTerm] = useState("");
  const [age, setAge] = useState("");
  const [size, setSize] = useState("");
  const [breed, setBreed] = useState("");

  const handleTermChange = (event) => {
    setTerm(event.target.value);
  };

  const handleAgeChange = (event) => {
    setAge(event.target.value);
  };

  const handleSizeChange = (event) => {
    setSize(event.target.value);
  };

  const handleBreedChange = (event) => {
    setBreed(event.target.value);
  };

  const handleSearch = (event) => {
    event.preventDefault();
    search(term, age, size, breed);
  };


  return (
    <>
      <div className="top-color-bar"></div>
      <div className="search-container">
        <div className="search-inner">
          <form onSubmit={handleSearch}>
            <div className="logo-search-row">
              <div className="logo-container">
                <img src={logo} alt="Pawfect match Logo" className="logo small-logo" />
              </div>


              <div className="button-container">
                <select id="age" value={age} onChange={handleAgeChange}>
                  <option value="">Any Age</option>
                  <option value="baby">Baby</option>
                  <option value="young">Young</option>
                  <option value="adult">Adult</option>
                  <option value="senior">Senior</option>
                </select>

                <select id="size" value={size} onChange={handleSizeChange}>
                  <option value="">Any Size</option>
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                  <option value="xlarge">Extra Large</option>
                </select>

                <select id="breed" value={breed} onChange={(handleBreedChange) => setBreed(handleBreedChange.target.value)}>
                  <option value="">Any Breed</option>
                  {breeds.map((breedName) => (
                    <option key={breedName} value={breedName} title={breedName}>
                      {breedName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="input-container">
                <div className="input-wrapper">
                  <input
                    placeholder="Search Dog"
                    onChange={handleTermChange}
                    value={term}
                  />
                  <button type="submit" className="icon-button">
                    <img src={searchicon} alt="Search icon" className="search-icon" />
                  </button>
                  <button type="submit" className="search-button">Search</button>
                </div>
              </div>
            </div>
          </form>
        </div>


      </div>

    </>
  );
}

export default SearchBar;