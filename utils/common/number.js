function rounding(num, n) {
	return Math.round((num * Math.pow(10, n)).toFixed(2)) / Math.pow(10, n);
}
module.exports = {
	rounding
}
