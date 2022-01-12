/** @param {NS} ns **/
import * as ServerUtils from "/scripts/utils/ServerUtils.js"

let copyScriptsPath = "/scripts/exec/CopyScripts.js"

export async function main(ns) {
	var servers = ServerUtils.getOwnedServers(ns)	
	for(var i = 0; i < servers.length; i++) {
		var server = servers[i]
		ns.run(copyScriptsPath, 1, server)
		await ns.sleep(500)
	}
	
}
