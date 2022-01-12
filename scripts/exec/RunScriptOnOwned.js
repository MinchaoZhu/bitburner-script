/** @param {NS} ns **/
import * as ServerUtils from "/scripts/utils/ServerUtils.js"
import * as MathUtils from "/scripts/utils/MathUtils.js"

// let memThreshHold = 262144 
let memThreshHold = 262144 

export async function main(ns) {
	var script = ns.args[0]
	var threads = ns.args[1]
	var option = ns.args[2]
	var argsNum = ns.args[3]

	threads = Math.ceil(threads)

	var ownedServers = ServerUtils.getComputingServers(ns, option)

	ownedServers.forEach(server => {
		if(ns.getServerUsedRam(server) < memThreshHold) {
			if(argsNum == 0) {
				ns.exec(script, server, threads, MathUtils.getRandInt(ns))
			} else if(argsNum == 1) {
				ns.exec(script, server, threads, ns.args[4], MathUtils.getRandInt(ns))
			} else if(argsNum == 2) {
				ns.exec(script, server, threads, ns.args[4], ns.args[5], MathUtils.getRandInt(ns))
			} else if(argsNum == 3) {
				ns.exec(script, server, threads, ns.args[4], ns.args[5], ns.args[6], MathUtils.getRandInt(ns))
			}
		}
	})

}