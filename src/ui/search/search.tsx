import { useState } from "react";
import { DatePicker, Select, Form, Button, Spin, Modal } from 'antd';
import { FlightSearchResult } from "../models/flight-search-result";
import moment from "moment";
import { multipleDestinationSearch } from "./integration";
import { airports } from "../models/airports";

const { RangePicker } = DatePicker;

const DATE_FORMAT = "YYYY-MM-DD";

const formStyle : React.CSSProperties = {
    maxWidth: '100%',
};

const labelStyle : React.CSSProperties = {
    color: '#fff',
    fontSize: 16,
}

const Search = ({ onChange } : { onChange : (results: FlightSearchResult[]) => void }) => {
    const [loading, setLoading] = useState(false);
    const [origin, setOrigin] = useState<string | undefined>(undefined);
    const [destination, setDestination] = useState<string[]>([]);
    const [from, setFrom] = useState<string | undefined>(undefined);
    const [to, setTo] = useState<string | undefined>(undefined);

    const options = airports.map(a => {
        return { value: a.IATA, label: `${a.name} - ${a.city} - ${a.country} (${a.IATA})`};
    });

    const onSubmit = () => {
        setLoading(true);
        multipleDestinationSearch(origin, destination, moment(from, DATE_FORMAT), moment(to, DATE_FORMAT), 1)
            .then(results => {
                if (results) {
                    onChange(results);
                } else {
                    alert('Error en búsqueda');
                }
            })
            .catch((err) => alert(`Error consultando vuelos: ${err}`))
            .finally(() => setLoading(false));
    };

    return <>
        <Modal open={loading} closable={false} footer={null} style={{textAlign: 'center'}}>
            <Spin size="large" tip="Loading"/>
        </Modal>
        <Form
            name="basic"
            layout="vertical"
            style={formStyle}
            initialValues={{ remember: true }}
            autoComplete="off"
            disabled={loading}
            onFinish={onSubmit}
        >
            <Form.Item label={<label style={labelStyle}>Origen</label>} name="origin" rules={[{ required: true }]}
                initialValue={'EZE'}
            >
                <Select
                    placeholder="Seleccionar origen"
                    onChange={e => setOrigin(e)}
                    options={options}
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                />
            </Form.Item>

            <Form.Item label={<label style={labelStyle}>Destinos</label>} name="destinations" rules={[{ required: true }]}>
                <Select
                    mode="multiple"
                    placeholder="Seleccionar destinos"
                    onChange={e => setDestination(e)}
                    options={options}
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                />
            </Form.Item>

            <Form.Item label={<label style={labelStyle}>Fechas de búsqueda</label>} name="dates" rules={[{ required: true }]}>
                <RangePicker onChange={ values => {
                    const fromDate = values?.[0]?.format("YYYY-MM-DD");
                    const toDate = values?.[1]?.format("YYYY-MM-DD");
                    setFrom(fromDate);
                    setTo(toDate);
                }}/>
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button htmlType="submit">Buscar</Button>
            </Form.Item>
        </Form>
    </>;
};

export default Search;