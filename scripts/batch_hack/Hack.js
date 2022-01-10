/** @param {NS} ns **/
import * as BatchHack from "/scripts/batch_hack/Start.js"
import * as ServerUtils from "/scripts/utils/ServerUtils.ns"
import * as MathUtils from "/scripts/utils/MathUtils.ns"

/**
 *  batch: HWGW 
 *  
 *  WWWWWWWWWWWWWWWWWWWWWWWWWWWW
 *    WWWWWWWWWWWWWWWWWWWWWWWWWWWW
 *                 HHHHHHHHHHHH
 *           GGGGGGGGGGGGGGGGGGGG
 * 
 */

let remoteRunPath = "/scripts/exec/RunScriptOnOwned.ns" 
let doWeakenPath = "/scripts/exec/doWeaken.ns"
let doGrowPath = "/scripts/exec/doGrow.ns"
let doHackPath = "/scripts/exec/doHack.ns"
let defaultDelay = 50
let hackRatio = 0.95
let batchDelay = 80
let startDelayUnit = 1000


function getDelays(ns, host) {
	var weakenTime = ns.getWeakenTime(host)
	var growTime = ns.getGrowTime(host)
	var hackTime = ns.getHackTime(host)
	
	var delay1 = 2.0 * defaultDelay
	var delay2 = weakenTime - defaultDelay - hackTime
	var delay3 = weakenTime + defaultDelay - growTime
	return {
		delayW: delay1,
		delayH: delay2,
		delayG: delay3
	}
}

function batchAnalyze(ns, host) {
	var hackAmount = ns.getServerMaxMoney(host) * hackRatio
	var hackThreads = Math.ceil(ns.hackAnalyzeThreads(host, hackAmount))
	var safeIncrHack = ns.hackAnalyzeSecurity(hackThreads)
	var weakenThreads1 = 1.03 * safeIncrHack / ns.weakenAnalyze(1, 1)
	
	var growThreads = ns.growthAnalyze(host, 1.0 / (1 - hackRatio)) * 1.03
	var safeIncrGrow = ns.growthAnalyzeSecurity(growThreads)
	var weakenThreads2 = safeIncrGrow / ns.weakenAnalyze(1, 1) * 1.03

	return {
		threadsH : hackThreads,
		threadsW1: weakenThreads1,
		threadsG : growThreads,
		threadsW2: weakenThreads2
	}
}


async function batchHack(ns, host, delays, batchAnalysis, option) {
	var serverNums = ServerUtils.getComputingServers(ns, option).length

	ns.run(remoteRunPath, 1, doWeakenPath, Math.ceil(batchAnalysis.threadsW1 / serverNums), option, 2, host, 0)
	ns.run(remoteRunPath, 1, doWeakenPath, Math.ceil(batchAnalysis.threadsW2 / serverNums), option, 2, host, delays.delayW)
	ns.run(remoteRunPath, 1, doGrowPath, Math.ceil(batchAnalysis.threadsG / serverNums), option, 2, host, delays.delayG)
	ns.run(remoteRunPath, 1, doHackPath, Math.ceil(batchAnalysis.threadsH / serverNums), option, 2, host, delays.delayH)
}

function logEndTime(ns, host) {
	var delays = getDelays(ns, host)
	var weakenTime = ns.getWeakenTime(host)
	var growTime = ns.getGrowTime(host)
	var hackTime = ns.getHackTime(host)
	ns.tprint("host: " + host)
	ns.tprint("delays: " + JSON.stringify(delays))
	ns.tprint("end time for H: " + ((delays.delayH + hackTime)/1000).toFixed(3) + "s")
	ns.tprint("end time for W1: " + ((weakenTime)/1000).toFixed(3) + "s")
	ns.tprint("end time for G: " + ((delays.delayG + growTime)/1000).toFixed(3) + "s")
	ns.tprint("end time for W2: " + ((delays.delayW + weakenTime)/1000).toFixed(3) + "s")
}

function logBatchAnalyze(ns, host) {
	var batchAnalysis = batchAnalyze(ns, host)
	ns.tprint("host: " + host)
	ns.tprint("batchAnalysis: " + JSON.stringify(batchAnalysis))
}

export async function main(ns) {
	var host = ns.args[0]
	var option = ns.args[1]
	var delays = getDelays(ns, host)
	var batchAnalysis = batchAnalyze(ns, host)
	logEndTime(ns, host)
	logBatchAnalyze(ns, host)

	await ns.sleep(startDelayUnit * (MathUtils.getRandInt(ns) % 20))

	while(BatchHack.prepared[host] === true) {
		batchHack(ns, host, delays, batchAnalysis, option)
		await ns.sleep(batchDelay)
	}
}