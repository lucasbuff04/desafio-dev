import React, {useState} from 'react';
import TransactionForm from '../../components/TransactionForm';
import TransactionList from '../../components/TransactionList';
import {TransactionsContext} from './context';
import Container from 'react-bootstrap/Container'

const Transactions = () => {
	const [transactions, setTransactions] = useState([]);
	const [total, setTotal] = useState(0);

	const value = {
		transactions, setTransactions, total, setTotal
	}
	return (
		<TransactionsContext.Provider value={value}>
			<Container>
				<h1>CNAB Parser</h1>
				<TransactionForm />
				<TransactionList />
			</Container>
		</TransactionsContext.Provider>
	)
}

export default Transactions;