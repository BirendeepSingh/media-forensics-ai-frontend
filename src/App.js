import { useState } from 'react';
import './App.css';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

function App() {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!text.trim()) return;
    setLoading(true);
    const res = await fetch('http://localhost:5000/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });
    const data = await res.json();
    setResult(data);
    setLoading(false);
  };

  return (
    <div className="App" style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>📰 Fake News Detector</h1>
      <textarea
        placeholder="Paste news content here..."
        rows={6}
        cols={70}
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{ fontSize: '16px', padding: '1rem', marginBottom: '1rem' }}
      />
      <br />
      <button onClick={handleSubmit} style={{ padding: '10px 20px', fontSize: '16px' }}>
        {loading ? 'Checking...' : 'Detect'}
      </button>

      {result && (
        <div style={{ marginTop: '2rem' }}>
          <div style={{ width: 150, margin: '0 auto' }}>
            <CircularProgressbar
              value={result.confidence * 100}
              text={`${(result.confidence * 100).toFixed(1)}%`}
              styles={{
                path: { stroke: result.label === 'REAL' ? 'green' : 'red' },
                text: { fill: '#333', fontSize: '16px' }
              }}
            />
          </div>
          <h2 style={{ color: result.label === 'REAL' ? 'green' : 'red', marginTop: '1rem' }}>
            Result: {result.label}
          </h2>
          <p><strong>Sentiment:</strong> {result.sentiment}</p>
          <p><strong>Bias Words:</strong> {result.bias_words.length > 0 ? result.bias_words.join(", ") : "None detected"}</p>
        </div>
      )}
    </div>
  );
}

export default App;
