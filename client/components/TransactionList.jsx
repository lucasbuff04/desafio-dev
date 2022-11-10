import React, { useContext, useEffect } from 'react';
import { TransactionsContext } from '../pages/transactions/context';
import Table from 'react-bootstrap/Table';

const types = [
	'Débito',
	'Boleto', 'Financiamento', 'Crédito', 'Recebimento Empréstimo', 'Vendas', 'Recebimento TED',
	'Recebimento DOC', 'Aluguel'
]

const moneyFormatter = Intl.NumberFormat("pt-BR", {
	style: "currency",
	currency: "BRL",
});
const TransactionList = () => {
	const { transactions, total, setTransactions, setTotal } = useContext(TransactionsContext);

	useEffect(() => {
		if(transactions.length) return;
		fetch('/v1/transactions')
			.then(res => res.json())
			.then(res => {
				setTotal(res.total);
				setTransactions(res.transactions);
			})
	}, []);

	return (
		<div>
			{
				!transactions.length || (
					<>
						<span>Total: {moneyFormatter.format(total)} </span>
						<Table striped bordered>
							<thead>
								<th>Data</th>
								<th>Hora</th>
								<th>CPF</th>
								<th>Cartão</th>
								<th>Dono</th>
								<th>Loja</th>
								<th>Tipo</th>
								<th>Valor</th>
							</thead>
							<tbody>
								{transactions.map(transaction => (
									<tr key={transaction.transaction_id}>
										<td>{new Date(transaction.transaction_date).toLocaleDateString()}</td>
										<td>{transaction.transaction_time}</td>
										<td>{transaction.cpf}</td>
										<td>{transaction.card_number}</td>
										<td>{transaction.store_owner}</td>
										<td>{transaction.store_name}</td>
										<td>{types[parseInt(transaction.transaction_type) + 1]}</td>
										<td>{moneyFormatter.format(transaction.transaction_value)}</td>
									</tr>
								))}
							</tbody>
						</Table>
					</>
				)
			}
		</div>
	)
}

export default TransactionList;