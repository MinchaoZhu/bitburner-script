/** @param {NS} ns **/
import * as MathUtils from "/scripts/utils/MathUtils.js"

export async function main(ns) {
	var server = ns.args[0]
	var maxRam = ns.getServerRam(ns.getHostname())[0]
	var maxThreads = maxRam / 2
	var threads = Math.min(2, maxThreads)
	var maxMoney = ns.getServerMaxMoney(server)
	var threshHold = maxMoney * 0.9
	if (ns.getServerMoneyAvailable(server) > threshHold) {
		ns.run("/scripts/exec/ForceWeaken.js", threads, server, MathUtils.getRandInt())
		ns.run("/scripts/exec/ForceGrow.js", threads, server, MathUtils.getRandInt())
	}

	ns.run("/scripts/exec/Weaken.js", threads, server, MathUtils.getRandInt())
	ns.run("/scripts/exec/Grow.js", threads, server, MathUtils.getRandInt())
	ns.run("/scripts/exec/Hack.js", threads, server, MathUtils.getRandInt())
}
