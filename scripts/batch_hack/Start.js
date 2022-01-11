/** @param {NS} ns **/
let prepared = {}

export {prepared}/** @param {NS} ns **/
import * as ServerUtils from "/scripts/utils/ServerUtils.ns"
import * as MathUtils from "/scripts/utils/MathUtils.ns"


let batchHackForOnePath = "/scripts/batch_hack/Hack.js"

export async function main(ns) {
	await ns.run("/scripts/remote/CopyScripts.ns")
	await ns.sleep(1000)
	var option = ns.args[0] // "home" "all"
	var hackableServers = ServerUtils.getHackableServers(ns)
	var execServers = ServerUtils.getComputingServers(ns, option)
	for(var i = 0; i < execServers.length; i++) {
		var j = MathUtils.getRandInt(ns) % hackableServers.length
		var server = hackableServers[j]
		hackableServers.splice(j, 1)
		ns.tprint("host: " + execServers[i] + " target: " + server)
		await ns.exec(batchHackForOnePath, execServers[i], 1, server)
		await ns.sleep(20)
	}	
}