/** @param {NS} ns **/
let prepared = {}
let start = false
let moneyThresh = 500000000 

export {prepared}/** @param {NS} ns **/
import * as ServerUtils from "/scripts/utils/ServerUtils.ns"
import * as MathUtils from "/scripts/utils/MathUtils.ns"


let preBatchForOnePath = "/scripts/batch_hack/PreBatchForOne.ns"
let batchHackForOnePath = "/scripts/batch_hack/Hack.js"

export async function main(ns) {
	if(ns.args[0] === "stop") {
		prepared = {}
		start = false
	} else if(ns.args[0] === "start") {
		var option = ns.args[1] // "home" "all"
		var hackableServers = ServerUtils.getHackableServers(ns)
		start = true
		while(start) {
			for(var i = 0; i < hackableServers.length; i++) {
				var server = hackableServers[i]
				if(ns.getServerMaxMoney(server) < moneyThresh) {
					continue
				}
				if(prepared[server] != true) {
					ns.run(preBatchForOnePath, 1, server, option)
				} else {
					ns.run(batchHackForOnePath, 1, server, option, 0)
					// ns.run(batchHackForOnePath, 1, server, option, 1)
					// ns.run(batchHackForOnePath, 1, server, option, 2)
					// ns.run(batchHackForOnePath, 1, server, option, 3)
					// ns.run(batchHackForOnePath, 1, server, option, 4)
					// ns.run(batchHackForOnePath, 1, server, option, 5)
					// ns.run(batchHackForOnePath, 1, server, option, 6)
					// ns.run(batchHackForOnePath, 1, server, option, 7)
					// ns.run(batchHackForOnePath, 1, server, option, 8)
					// ns.run(batchHackForOnePath, 1, server, option, 9)
				}
				await ns.sleep(20)
			}
			await ns.sleep(10000)
		}

	}
}