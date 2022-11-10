let {formatDate, formatTime, formatValue} = require('./index')

describe('Index', () => {
	test('formatDate()', () => {
		expect(formatDate('20220629')).toBe('2022-06-29')
		expect(formatDate('20211103')).toBe('2021-11-03')
		expect(formatDate('19930528')).toBe('1993-05-28')
	}) 

	test('formatTime()', () => {
		expect(formatTime('123456')).toBe('12:34:56')
		expect(formatTime('065959')).toBe('06:59:59')
		expect(formatTime('110348')).toBe('11:03:48')
		expect(formatTime('103502')).toBe('10:35:02')
	})

	test('formatValue()', () => {
		expect(formatValue('0000014200')).toBe(142);
		expect(formatValue('0000095826')).toBe(958.26);
		expect(formatValue('1000095822')).toBe(10000958.22);
	})
})