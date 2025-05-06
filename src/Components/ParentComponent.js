import DogCard from './DogCard';

function ParentComponent({ dogs }) {
 const uniqueDogs = dogs.filter(
  (dog, index, self) => index === self.findIndex(d => d.id === dog.id)
 );

 return (
  <div className="list-container">
   {uniqueDogs.map(dog => (
    <DogCard key={dog.id} dog={dog} fact={dog.fact} />
   ))}
  </div>
 );
}

export default ParentComponent;
