/** @param {NS} ns **/
export async function main(ns) {
	var syms = ns.stock.getSymbols()
	var stocksValues = 0
	syms.forEach(sym => {
		stocksValues += ns.stock.getAskPrice(sym) * ns.stock.getPosition(sym)[0]
	})
	ns.tprint("stock values: " + (stocksValues/1000000).toFixed(2) + "m")
	ns.tprint("cash  values: " + (ns.getPlayer().money/1000000).toFixed(2) + "m")
	ns.tprint("sum         : " + ((stocksValues + ns.getPlayer().money)/1000000).toFixed(2) + "m")
}