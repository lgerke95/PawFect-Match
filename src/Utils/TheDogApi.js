const apiKey = "​​live_Wd5k7792nCMHM6AVjXPvSJAFcOLzqsh2E7zi5i7ZQdhWYCskV2Nyw7Ety7nivc5M";

const endPoint = "https://api.thedogapi.com/v1/breeds/search?q=";

const searchTheDogApi = async (breed) => {
    try {
      const cleanedBreed = breed.toLowerCase().replace(/[^a-z ]/gi, "").trim();
  
      let response = await fetch(`https://api.thedogapi.com/v1/breeds/search?q=${cleanedBreed}`);
      let data = await response.json();
  
      // If no match found, try first word
      if (data.length === 0 && cleanedBreed.includes(" ")) {
        const fallback = cleanedBreed.split(" ")[0];
        response = await fetch(`https://api.thedogapi.com/v1/breeds/search?q=${fallback}`);
        data = await response.json();
      }
  
      if (data.length > 0) {
        return data[0].temperament || "No temperament info found.";
      } else {
        return "No info found for this breed.";
      }
    } catch (error) {
      console.error("Error fetching breed fact:", error);
      return "Error fetching fact.";
    }
  };
  

export default searchTheDogApi;
