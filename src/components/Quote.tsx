import { useState, useEffect } from 'react';
import './Quote.css';

interface Quote {
  text: string;
  author: string;
}

function Quote() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const getQuotes = async () => {
    setLoading(true);
    const apiUrl =
      'https://jacintodesign.github.io/quotes-api/data/quotes.json';
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      setQuotes(data);
      setCurrentQuote(data[Math.floor(Math.random() * data.length)]);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching quotes:', error);
    }
  };

  const newQuote = () => {
    if (quotes.length === 0) return;
    setLoading(true);
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setCurrentQuote(randomQuote);
    setLoading(false);
  };

  const tweetQuote = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${currentQuote?.text} - ${currentQuote?.author}`;
    window.open(twitterUrl, '_blank');
  };

  useEffect(() => {
    getQuotes();
  }, []);
  return (
    <>
      {loading ? (
        <div className="loader" />
      ) : (
        <div className="quote-container" id="quote-container">
          <div className="quote-text">
            <i className="fas fa-quote-left"></i>
            <span
              id="quote"
              className={
                currentQuote && currentQuote.text.length > 120
                  ? 'long-quote'
                  : ''
              }
            >
              {currentQuote?.text}
            </span>
          </div>
          <div className="quote-author">
            <span className="author" id="author">
              {currentQuote?.author || 'Unknown'}
            </span>
          </div>
          <div className="button-container quote-button">
            <button
              className="twitter-button"
              onClick={tweetQuote}
              title="Tweet This!"
            >
              <i className="fa-brands fa-twitter"></i>
            </button>
            <button className="new-quote quote-button" onClick={newQuote}>
              New Quote
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Quote;
