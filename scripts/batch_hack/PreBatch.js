/** @param {NS} ns **/
import * as ServerUtils from "/scripts/utils/ServerUtils.js"

let preBatchForOnePath = "/scripts/batch_hack/PreBatchForOne.js"

export async function main(ns) {
	var option = ns.args[0]
	var hackableServers = ServerUtils.getHackableServers(ns)
	hackableServers.forEach(server => {
		ns.run(preBatchForOnePath, 1, server, option)
	})
}