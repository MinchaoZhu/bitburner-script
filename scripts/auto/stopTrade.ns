/** @param {NS} ns **/
export async function main(ns) {
	var syms = ns.stock.getSymbols()

	syms.forEach(sym => {
		ns.kill("/scripts/stock/tradeOne.ns", "home", sym)
	})
}