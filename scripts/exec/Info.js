/** @param {NS} ns **/
export async function main(ns) {
	var host = ns.args[0]

	ns.tprint("Host Info [" + host +"]")
	ns.tprint("current security: " + ns.getServerSecurityLevel(host))
	ns.tprint("min security    : " + ns.getServerMinSecurityLevel(host))
	ns.tprint("current money   : " + (ns.getServerMoneyAvailable(host)/1000000).toFixed(2) + "m")
	ns.tprint("max money       : " + (ns.getServerMaxMoney(host)/1000000).toFixed(2) + "m")
	ns.tprint("hack time       : " + (ns.getHackTime(host)/1000).toFixed(2) + "s")
	ns.tprint("grow time       : " + (ns.getGrowTime(host)/1000).toFixed(2) + "s")
	ns.tprint("weaken time     : " + (ns.getWeakenTime(host)/1000).toFixed(2) + "s")
}