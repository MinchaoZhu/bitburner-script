/** @param {NS} ns **/
export async function main(ns) {
	var syms = ns.stock.getSymbols()

	syms.forEach(sym => {
		ns.run("/scripts/stock/tradeOne.js", 1, sym)
	})
}