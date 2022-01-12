/** @param {NS} ns **/
import * as ServerUtils from "/scripts/utils/ServerUtils.js"

export async function main(ns) {
	while(true) {
		await ns.sleep(5000) 
		var owneds = ServerUtils.getOwnedServers(ns)
		owneds.forEach(owned => {
			ns.run("/scripts/exec/CopyScripts.js", 1, owned)
			ns.kill("/scripts/auto/HackRand.js", owned)
			ns.exec("/scripts/auto/HackRand.js", owned)
		})
	}

}