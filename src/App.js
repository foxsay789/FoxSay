import React, { useState, useEffect } from 'react';
import './App.css';

const popularDomains = [
  'google.com',
  'facebook.com',
  'twitter.com',
  'apple.com',
  'microsoft.com'
];

function App() {
  const [domain, setDomain] = useState('');
  const [domains, setDomains] = useState(popularDomains);
  const [results, setResults] = useState([]);

  useEffect(() => {
    // 自动检测内置域名
    checkDomains(domains);
  }, []);

  const handleInputChange = (e) => {
    setDomain(e.target.value);
  };

  const handleAddDomain = () => {
    if (domain.trim()) {
      setDomains([...domains, domain]);
      setDomain('');
      checkDomains([...domains, domain]);
    }
  };

  const checkDomains = async (domainsToCheck = domains) => {
    try {
      const startTime = performance.now();
      const results = await Promise.all(domainsToCheck.map(async (d) => {
        const domainStartTime = performance.now();
        const response = await fetch(`https://cloudflare-dns.com/dns-query?name=${d}&type=A`, {
          method: 'GET',
          headers: {
            'Accept': 'application/dns-json'
          }
        });
        const endTime = performance.now();
        const result = await response.json();
        return {
          domain: d,
          status: response.ok ? 'Available' : 'Not Available',
          dnsTime: endTime - domainStartTime,
          totalTime: endTime - startTime,
          data: result
        };
      }));
      setResults(results);
    } catch (error) {
      console.error('Error checking domains:', error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
    <h1>Advanced Domain Availability Checker</h1>
            <input
              type="text"
              placeholder="Enter domain name"
              value={domain}
              onChange={handleInputChange}
              className="domain-input"
            />
            <button onClick={handleAddDomain}>Add Domain</button>
            <ul className="domain-list">
              {results.map((result) => (
                <li key={result.domain} className="domain-item">
                  <span>{result.domain}</span>
                  <span className={`status-icon ${result.status === 'Available' ? 'success' : 'failure'}`}>
                    {result.status === 'Available' ? '✓' : '✗'}
                  </span>
                  <span className="status-time">DNS Time: {result.dnsTime.toFixed(2)}ms</span>
                  <span className="status-time">Total Time: {result.totalTime.toFixed(2)}ms</span>
                </li>
              ))}
            </ul>
      </header>
    </div>
  );
}

export default App;