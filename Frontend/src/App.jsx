import React, { useState } from 'react';
import FileUpload from './components/FileUpload';
import GraphViewer from './components/GraphViewer';

const App = () => {
  const [graphData, setGraphData] = useState(null);

  const handleGraphDataFetched = (data) => {
    setGraphData(data);
  };

  return (
    <div className="App">
      <h1>Upload and Visualize Graph</h1>

      <FileUpload onGraphDataFetched={handleGraphDataFetched} />

      {graphData ? (
        <GraphViewer graphData={graphData} />
      ) : (
        <p>No graph data available. Upload a file to visualize.</p>
      )}
    </div>
  );
};

export default App;
