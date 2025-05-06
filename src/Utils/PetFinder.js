import "./petfinder.css";

const apiKey = "rdlmyvtuT3vbjgm7WGhf7iZfmUvXahthPQvRKwDKmzOaXp9Mq2";
const apiSecret = "Bis2LoFEHbHcs85pTKcMRMeyI9i4jcaC3HxeBevK";
const BASE_URL = "https://api.petfinder.com/v2";

let accessToken = '';
let tokenExpiry = 0;

async function authenticate() {
  const now = Date.now();

  if (!accessToken || now > tokenExpiry) {
    const response = await fetch(`${BASE_URL}/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `grant_type=client_credentials&client_id=${apiKey}&client_secret=${apiSecret}`
    });

    const data = await response.json();
    accessToken = data.access_token;
    tokenExpiry = now + data.expires_in * 1000;
  }

  return accessToken;
}

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const searchPetFinder = async (term, age, size, breed) => {
  try {
    const token = await authenticate();

    const perPage = 20;


    const noFilters = !term && !age && !size && !breed;
    const totalPages = noFilters ? 4 : 1;

    let allDogs = [];

    for (let page = 1; page <= totalPages; page++) {
      let url = `${BASE_URL}/animals?type=dog&limit=${perPage}&page=${page}`;

      if (term) url += `&name=${encodeURIComponent(term)}`;
      if (age) url += `&age=${encodeURIComponent(age)}`;
      if (size) url += `&size=${encodeURIComponent(size.toLowerCase())}`;
      if (breed) url += `&breed=${encodeURIComponent(breed)}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (response.ok) {
        const data = await response.json();
        allDogs = allDogs.concat(data.animals);
      } else {
        console.error("Failed to fetch dogs from page", page, response.status);
      }
    }


    const uniqueById = allDogs.filter(
      (dog, index, self) => index === self.findIndex(d => d.id === dog.id)
    );


    const seenNames = new Set();
    const uniqueByName = uniqueById.filter(dog => {
      const name = (dog.name || '').toLowerCase().trim();
      if (!name || seenNames.has(name)) return false;
      seenNames.add(name);
      return true;
    });


    const dogsWithPhotos = uniqueByName.filter(
      dog =>
        Array.isArray(dog.photos) &&
        dog.photos.length > 0 &&
        dog.photos[0].medium
    );

    if (dogsWithPhotos.length < 12) {
      const extras = shuffleArray(uniqueByName.filter(d => d.photos?.length > 0 && !dogsWithPhotos.includes(d)));
      dogsWithPhotos.push(...extras.slice(0, 12 - dogsWithPhotos.length));
    }

    return shuffleArray(dogsWithPhotos).slice(0, 12);

  } catch (error) {
    console.log(error);
    return [];
  }
};



export default searchPetFinder;
export { authenticate };
