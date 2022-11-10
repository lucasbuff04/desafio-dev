const express = require('express');
const multer = require('multer');
const path = require('path');
const bodyParser = require('body-parser');
const storage = multer.memoryStorage()
const upload = multer({ storage }).single('upload_file');
const app = express();
const port = 3001;

const { Client } = require('pg')
const client = new Client()
client.connect()

const router = express.Router();


router.get('/', (req, res) => {
	res.send('API is working!')
})

const formatDate = (text) =>
	`${text.slice(0, 4)}-${text.slice(4, 6)}-${text.slice(6, 8)}`

const formatValue = text => parseFloat((parseInt(text) / 100).toFixed(2))

const formatTime = text => `${text.slice(0, 2)}:${text.slice(2, 4)}:${text.slice(4, 6)}`

const handleTransactions = (fileText) => {
	const fileLines = fileText.split('\n').slice(0, -1);
	return fileLines.map(line => ({
		transaction_type: line.slice(0, 1),
		transaction_date: formatDate(line.slice(1, 9)),
		transaction_value: formatValue(line.slice(9, 19)),
		cpf: line.slice(19, 30),
		card_number: line.slice(30, 42),
		transaction_time: formatTime(line.slice(42, 48)),
		store_owner: line.slice(48, 62).trim(),
		store_name: line.slice(62, 82).trim(),
	}));
}

const retrieveTransactions = () => {
	return new Promise((resolve, reject) => {
		client.query('SELECT * FROM transactions;', (err, res) => {
			if (err) {
				reject({ error: err.stack });
			} else {
				resolve(res.rows)
			}
		})
	})
}

const updateTransactions = async transactions => {
	const query = `
		INSERT INTO transactions(${Object.keys(transactions[0]).toString()})
		VALUES
		${transactions.map(transaction => `(${Object.values(transaction).map(value => `'${value}'`)})`)}
		RETURNING *;
	`;

	return new Promise((resolve, reject) => {

		client.query(query, async (err) => {
			if (err) {
				reject({ error: err.stack });
			} else {
				const results = await retrieveTransactions()
				resolve(results);
			}
		})
	})
}

const expenses = ['2', '3', '9']

const calculateTransactions = (valueOne, valueTwo, type) => {
	return expenses.includes(type) ? valueOne - valueTwo : valueOne + valueTwo;
}

const calculateTotal = transactions => {
	if(!transactions.length) return 0;

	return transactions.reduce((calcSoFar, transaction) => {
		const valueSoFar = typeof calcSoFar === 'object' ? calcSoFar.transaction_value : calcSoFar;
		return calculateTransactions(
			parseFloat(valueSoFar),
			parseFloat(transaction.transaction_value),
			transaction.transaction_type
		)
	})
}

router.post('/uploadFile/', upload, async (req, res) => {
	const { file } = req;
	const buffer = Buffer.from(file.buffer);
	const transactions = handleTransactions(buffer.toString());
	const allTransactions = await updateTransactions(transactions);

	res.send({ total: calculateTotal(allTransactions), transactions: allTransactions });
})

router.get('/transactions', async (req, res) => {
	const transactions = await retrieveTransactions();

	res.send({ total: calculateTotal(transactions), transactions: transactions });
});

// app.use(express.static(path.resolve(__dirname, './client/dist')));
app.use(bodyParser.urlencoded({
	extended: false
}));

app.use(bodyParser.json());
app.use('/v1', router);

// All other GET requests not handled before will return our React app
// app.get('*', (req, res) => {
//   res.sendFile(path.resolve(__dirname, './client/dist', 'index.html'));
// });

app.listen(port, () => {
	console.log(`Server listening on port ${port}`)
})

module.exports = {
	formatDate,
	formatTime,
	formatValue, 
	client
}