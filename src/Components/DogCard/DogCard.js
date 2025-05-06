import { useState } from 'react';
import './DogCard.css';

function DogCard({ dog, fact }) {
  const [showFact, setShowFact] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [imageError, setImageError] = useState(false); 

  const toggleFact = () => {
    if (window.innerWidth < 768) {
      setShowFact(!showFact);
    }
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded); 
  };

  const handleImageError = () => {
    setImageError(true);
  };

  
  if (imageError) {
    return null; 
  }

  const limitDescription = (text, maxWords) => {
    if (!text) return '';
    const words = text.split(' ');
    if (words.length <= maxWords) return text;
    return words.slice(0, maxWords).join(' ') + '...';
  };

  return (
    <div
      className={`card-container ${isExpanded ? 'expanded' : ''}`}
      onClick={toggleExpand}
    >
      <div className="image-container" onClick={toggleFact}
           onMouseEnter={() => window.innerWidth >= 768 && setShowFact(true)}
           onMouseLeave={() => window.innerWidth >= 768 && setShowFact(false)}
      >
        <img
          src={dog.photos?.[0]?.medium || "https://placedog.net/500"}
          alt={dog.name}
          onError={handleImageError} 
        />
        {showFact && (
          <div className="funfact-overlay">
            <p>{fact || "No fun fact available for this breed."}</p>
          </div>
        )}
      </div>

      <div className="details-container">
        <div>
          <h3>{typeof dog.name === 'string' && dog.name.length < 50 ? dog.name : "Unnamed Dog"}</h3>
          <div className="info">
            <p><strong>Breed:</strong> {dog.breeds?.primary || 'Unknown'}</p>
            <p><strong>Size:</strong> {dog.size}</p>
            <p><strong>Age:</strong> {dog.age || 'Unknown'}</p>
            <p><strong>Location:</strong> {dog.contact?.address?.city || 'Unknown'}, {dog.contact?.address?.state || ''}</p>
            <p><strong>Description:</strong> {isExpanded ? limitDescription(dog.description, 100) : limitDescription(dog.description, 5)}</p>
            {dog.description && dog.description.length > 5 && (
              <button className="read-more-button" onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}>
                {isExpanded ? 'Read Less' : 'Read More'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DogCard;
