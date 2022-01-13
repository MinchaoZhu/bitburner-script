/** @param {NS} ns **/
import * as BatchHack from "/scripts/batch_hack/Start.js"

let doWeakenPath = "/scripts/exec/doWeaken.js"
let doGrowPath = "/scripts/exec/doGrow.js"

async function preBatchWeaken(ns, host) {
	var currentSafeLevel = ns.getServerSecurityLevel(host)
	var minSafeLevel = ns.getServerMinSecurityLevel(host)

	while(currentSafeLevel > minSafeLevel) {
		var oneThreadDecr = ns.weakenAnalyze(1, ns.getServer().cpuCores)
		var fullDecr = currentSafeLevel - minSafeLevel

		var fullThreads = fullDecr / oneThreadDecr
		var actionThreads = Math.ceil(fullThreads)
		var currentServer = ns.getServer()
		
		var maxThreads = 0.9 * (currentServer.maxRam - currentServer.ramUsed) / ns.getScriptRam(doWeakenPath)
		if(fullThreads >= maxThreads) {
			actionThreads = maxThreads
		}
		actionThreads = Math.max(1, actionThreads)
		var weakenTime = ns.getWeakenTime(host)

		ns.run(doWeakenPath, actionThreads, host, 0)
		await ns.sleep(weakenTime + 1000)
		currentSafeLevel = ns.getServerSecurityLevel(host)
		minSafeLevel = ns.getServerMinSecurityLevel(host)
	}
}

async function growAndWeaken(ns, host, growThreads) {
	var currentServer = ns.getServer()
	var weakenDelay = 3000
	var incrSafeLevel = ns.getServerSecurityLevel(host) - ns.getServerMinSecurityLevel(host) + ns.growthAnalyzeSecurity(growThreads)
	var oneThreadDecr = ns.weakenAnalyze(1, ns.getServer().cpuCores)
	var weakenThreads = (incrSafeLevel / oneThreadDecr) * 1.05

	var growTime = ns.getGrowTime(host)
	var weakenTime = ns.getWeakenTime(host)
	weakenThreads = Math.max(1, weakenThreads)

	if(weakenTime < growTime) {
		weakenDelay += growTime - weakenTime
	}
	var ramUsed = (weakenThreads * ns.getScriptRam(doWeakenPath)) + (growThreads * ns.getScriptRam(doGrowPath))
	var scale = (currentServer.maxRam - currentServer.ramUsed) * 0.95 / ramUsed
	scale = scale >= 1 ? 1 : scale
	ns.run(doGrowPath, Math.ceil(growThreads * scale), host, 0)
	await ns.sleep(weakenDelay)
	ns.run(doWeakenPath, Math.ceil(weakenThreads * scale), host, 0)
	await ns.sleep(weakenTime)
}

async function preBatchGrow(ns, host) {
	var currentMoney = ns.getServerMoneyAvailable(host)
	var maxMoney = ns.getServerMaxMoney(host)
	
	while(currentMoney < maxMoney) {
		var currentMoney = ns.getServerMoneyAvailable(host)
		var maxMoney = ns.getServerMaxMoney(host)

		var growTime = ns.getGrowTime(host)
		var weakenTime = ns.getWeakenTime(host)

		if(currentMoney <= 1000) {
			await growAndWeaken(ns, host, defaultThreads)
		} else {
			var growThreads = ns.growthAnalyze(host, Math.ceil(maxMoney / currentMoney))
			growThreads = Math.max(1, growThreads)
			await growAndWeaken(ns, host, growThreads)
		}
		await ns.sleep(3000)
		currentMoney = ns.getServerMoneyAvailable(host)
		maxMoney = ns.getServerMaxMoney(host)
	}
}

async function preBatchForHost(ns, host) {
	ns.tprint("Prebatch job for host [" + host + "] starts")
	await preBatchWeaken(ns, host)
	await preBatchGrow(ns, host)
	ns.tprint("Prebatch job for host [" + host + "] ends")
}

export async function main(ns) {
	var host = ns.args[0]
	await preBatchForHost(ns, host)
	BatchHack.prepared[host] = true
}
