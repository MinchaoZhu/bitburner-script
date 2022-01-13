/** @param {NS} ns **/
import * as MathUtils from "/scripts/utils/MathUtils.ns"
import * as ServerUtils from "/scripts/utils/ServerUtils.ns"

let batchHackPath = "/scripts/batch_hack/Hack.js"

export async function main(ns) {

	var hosts = ServerUtils.getHackableServers(ns)
	hosts.sort((a,b) => {
		var serverA = ns.getServer(a)
		var serverB = ns.getServer(b)
		return serverB.moneyMax - serverA.moneyMax
	})	

	for(var i = 0; i <= 15; i++) {
		var host = hosts[i]
		await ns.run(batchHackPath, 1, host)
		await ns.sleep(100)
	}

}