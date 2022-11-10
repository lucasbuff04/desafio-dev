
import React, {useState, useContext} from 'react';
import {TransactionsContext} from '../pages/transactions/context';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import FormGroup from 'react-bootstrap/FormGroup';
import FormControl from 'react-bootstrap/FormControl';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

const TransactionForm = () => {
	const [file, setFile] = useState(null)
	const {setTransactions, setTotal} = useContext(TransactionsContext);

	const handleSubmit = async (event) => {
		event.preventDefault();
		if(!file) return false;
		const formData  = new FormData();
		formData.append('upload_file', file);
		const response = await fetch('/v1/uploadFile', {method: 'POST', body: formData})
		const data = await response.json()
		const {transactions, total} = data;
		setTransactions(transactions);
		setTotal(total);
		document.getElementById('file').value = "";
		setFile(null);
	}

	const handleFileChange = event => {
		setFile(event.target.files[0]);
	}

	return (
		<Form onSubmit={handleSubmit} className="mb-3">
			<Row>
				<Col xs="6">
					<FormGroup>
						<FormControl id="file" type="file" name="upload_file" onChange={handleFileChange}/>
					</FormGroup>
				</Col>
				<Col xs="6" sm="2">
					<Button disabled={!file} type="submit" required>Enviar</Button>
				</Col>
			</Row>
		</Form>
	)
}

export default TransactionForm;