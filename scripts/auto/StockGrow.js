/** @param {NS} ns **/
import * as MathUtils from "/scripts/utils/MathUtils.js"

export async function main(ns) {
	var host = ns.args[0]

	while(true) {
		await ns.sleep(100)
		ns.run("/scripts/exec/StockGrow.js",64 , host, MathUtils.getRandInt(ns))
	}

}