/** @param {NS} ns **/
import * as MathUtils from "/scripts/utils/MathUtils.js"
import * as ServerUtils from "/scripts/utils/ServerUtils.js"

export async function main(ns) {
	while(true) {
		var servers = ServerUtils.getHackableServers(ns)
		var index = MathUtils.getRandInt(ns) % servers.length

		ns.print("server to be hacked: ", servers[index])
		ns.run("/scripts/exec/HackOne.ns", 1, servers[index])
		await ns.sleep(100)
	}
}
