/** @param {NS} ns **/
import * as MathUtils from "/scripts/utils/MathUtils.js"

export async function main(ns) {
	var targetHost = ns.args[0]
	var maxMoney = ns.getServerMaxMoney(targetHost)
	var threshHold = maxMoney * 0.9

	if (ns.getServerMoneyAvailable(targetHost) > threshHold) {
		ns.print("host: "+ targetHost + ", current money: " + ns.getServerMoneyAvailable(targetHost))
		ns.print("host: "+ targetHost + ", minimum money: " + threshHold)
		ns.run("/scripts/exec/ForceWeaken.js", 1, targetHost, MathUtils.getRandInt())
		ns.run("/scripts/exec/ForceGrow.js", 1, targetHost, MathUtils.getRandInt())
		await ns.hack(targetHost)
	}	
}