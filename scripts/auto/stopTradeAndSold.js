/** @param {NS} ns **/
export async function main(ns) {
	var syms = ns.stock.getSymbols()

	syms.forEach(sym => {
		ns.kill("/scripts/stock/tradeOne.js", "home", sym)
		ns.stock.sell(sym, ns.stock.getPosition(sym)[0])
	})
}