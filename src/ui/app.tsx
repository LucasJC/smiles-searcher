// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Search from './search/search';
import { Layout, Space } from 'antd';
import FlightResults from './flight-results/flight-results';
import { useState } from 'react';
import { FlightSearchResult } from './models/flight-search-result';
const { Header, Content } = Layout;

function App() {

  const headerStyle: React.CSSProperties = {
    textAlign: 'center',
    color: '#fff',
    height: 64,
    fontSize: 24,
    paddingInline: 50,
    lineHeight: '64px',
    backgroundColor: '#21325E',
    borderRadius: '20px 20px 0px 0px',
  };
  
  const contentStyle: React.CSSProperties = {
    textAlign: 'center',
    minHeight: 120,
    padding: 36,
    lineHeight: '120px',
    color: '#fff',
    backgroundColor: '#3E497A',
    borderRadius: '0px 0px 20px 20px',
  };

  const [ searchResults, setSearchResults ] = useState<FlightSearchResult[]>([]);

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Layout>
        <Header className='header' style={headerStyle}>Buscador Smiles</Header>
        <Content className='content' style={contentStyle}>
          <Search onChange={newResults => setSearchResults(newResults)} />
          <FlightResults results={searchResults} />
        </Content>
      </Layout>
    </Space>
  );
}

export default App;
