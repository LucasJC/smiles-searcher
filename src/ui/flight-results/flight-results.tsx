import Table, { ColumnsType } from 'antd/es/table';
import { FlightSearchResult } from '../models/flight-search-result';
import { CopyOutlined } from '@ant-design/icons';
import { clipboard } from 'electron';
import { Space, Statistic } from 'antd';

const columns: ColumnsType<FlightSearchResult> = [
    { title: 'Salida', dataIndex: 'departure', key: 'departure' },
    { title: 'Origen', dataIndex: 'origin', key: 'origin' },
    { title: 'Destino', dataIndex: 'destination', key: 'destination' },
    { title: 'Vuelos', dataIndex: 'count', key: 'count' },
    { title: 'Millas', dataIndex: 'miles', key: 'miles',
        render: m => <Statistic
            value={m} precision={0}
            valueStyle={{ fontSize: 14, fontWeight: 'bold' }}
        />
    },
    { title: 'Link', dataIndex: 'query', key: 'query', 
        render: q => {
            return <Space>
                <a href={q} target={'_blank'}>Ir a Smiles</a>
                <CopyOutlined onClick={() => clipboard.writeText(q)} />
            </Space>;
        }
    },
];

const FlightResults = ({ results = [] } : { results: FlightSearchResult[] }) => {
    return <Table columns={columns} dataSource={results} pagination={false} />
};

export default FlightResults;