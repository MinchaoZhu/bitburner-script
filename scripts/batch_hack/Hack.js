/** @param {NS} ns **/
import * as MathUtils from "/scripts/utils/MathUtils.js"

/**
 *  batch: HWGW 
 *  
 *  WWWWWWWWWWWWWWWWWWWWWWWWWWWW
 *    WWWWWWWWWWWWWWWWWWWWWWWWWWWW
 *                 HHHHHHHHHHHH
 *           GGGGGGGGGGGGGGGGGGGG
 * 
 */
let preparedDataPath = "/scripts/data/prepared/"
let preBatchForOnePath = "/scripts/batch_hack/PreBatchForOne.js"
let doWeakenPath = "/scripts/exec/doWeaken.js"
let doGrowPath = "/scripts/exec/doGrow.js"
let doHackPath = "/scripts/exec/doHack.js"
let defaultDelay = 100
let hackRatio = 0.85
let batchDelay = 90
let oneRoundTimeScale = 6

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

function batchMemNeeded(ns, batchAnalysis) {
	var weakenMem = ns.getScriptRam(doWeakenPath)
	var growMem = ns.getScriptRam(doGrowPath)
	var hackMem = ns.getScriptRam(doHackPath)
	return weakenMem * (batchAnalysis.threadsW1 + batchAnalysis.threadsW2)
		+  growMem * batchAnalysis.threadsG
		+  hackMem * batchAnalysis.threadsH
}

function batchScaleFactor(ns, batchAnalysis) {
	var ram = ns.getServer().maxRam
	var batchRam = batchMemNeeded(ns, batchAnalysis)
	var factor = 0.9 * ram / batchRam
	return factor > 1 ? 1 : factor
}

function batchAnalyze(ns, host) {
	var server = ns.getServer()

	var hackThreads = hackRatio / ns.hackAnalyze(host)
	var safeIncrHack = ns.hackAnalyzeSecurity(hackThreads)
	var weakenThreads1 = 1.03 * safeIncrHack / ns.weakenAnalyze(1, server.cpuCores)
	
	var growThreads = ns.growthAnalyze(host, 1.0 / (1 - hackRatio)) * 1.03
	var safeIncrGrow = ns.growthAnalyzeSecurity(growThreads)
	var weakenThreads2 = safeIncrGrow / ns.weakenAnalyze(1, server.cpuCores) * 1.03

	var batchAnalysis = {
		threadsH : Math.floor(hackThreads),
		threadsW1: Math.ceil(weakenThreads1),
		threadsG : Math.ceil(growThreads),
		threadsW2: Math.ceil(weakenThreads2)
	}
	var scaleFactor = batchScaleFactor(ns, batchAnalysis)
	Object.keys(batchAnalysis).forEach(
		key => {
			batchAnalysis[key] *= scaleFactor
			batchAnalysis[key] = Math.max(batchAnalysis[key], 1)
		}
	)
	
	return batchAnalysis
}

async function batchHack(ns, host, delays, batchAnalysis) {
	ns.run(doWeakenPath, batchAnalysis.threadsW1, host, 0, MathUtils.getRandInt(ns))
	ns.run(doWeakenPath, batchAnalysis.threadsW2, host, delays.delayW, MathUtils.getRandInt(ns))
	ns.run(doGrowPath,   batchAnalysis.threadsG,  host, delays.delayG, MathUtils.getRandInt(ns))
	ns.run(doHackPath,   batchAnalysis.threadsH,  host, delays.delayH, MathUtils.getRandInt(ns))
}

function logEndTime(ns, host) {
	var delays = getDelays(ns, host)
	var weakenTime = ns.getWeakenTime(host)
	var growTime = ns.getGrowTime(host)
	var hackTime = ns.getHackTime(host)
	ns.tprint("host: " + host)
	ns.tprint("delays: " + JSON.stringify(delays))
	ns.tprint("end time for H:  " + ((delays.delayH + hackTime)/1000).toFixed(3) + "s")
	ns.tprint("end time for W1: " + ((weakenTime)/1000).toFixed(3) + "s")
	ns.tprint("end time for G:  " + ((delays.delayG + growTime)/1000).toFixed(3) + "s")
	ns.tprint("end time for W2: " + ((delays.delayW + weakenTime)/1000).toFixed(3) + "s")
}

export async function setPrepared(ns, host, value) {
	var fileName = preparedDataPath + host + ".txt"
	if(value) {
		await ns.write(fileName, "prepared")
	} else {
		await ns.rm(fileName)
	}
}

export async function isPrepared(ns, host) {
	var fileName = preparedDataPath + host + ".txt"
	return await ns.fileExists(fileName)
}

function logBatchAnalyze(ns, host) {
	var batchAnalysis = batchAnalyze(ns, host)
	ns.tprint("batchAnalysis:   " + JSON.stringify(batchAnalysis))
}
function logBatchMemNeeded(ns, batchAnalysis) {
	var memNeeded = batchMemNeeded(ns, batchAnalysis)
	ns.tprint("mem needed:      " + memNeeded + "GB")
}

export async function main(ns) {
	var host = ns.args[0]
	var round = 0

	setPrepared(ns, host, false)
	while(await isPrepared(ns, host) != true) {
		ns.run(preBatchForOnePath, 1, host)
		await ns.sleep(1000)
	}

	var delays = getDelays(ns, host)
	var batchAnalysis = batchAnalyze(ns, host)
	var memNeeded = batchMemNeeded(ns, batchAnalysis)

	logEndTime(ns, host)
	logBatchAnalyze(ns, host)
	logBatchMemNeeded(ns, batchAnalysis)

	while(true) {
		var startTime = Date.now()
		while(await isPrepared(ns, host) != true) {
			ns.run(preBatchForOnePath, 1, host)
			await ns.sleep(5000)
		}
		round += 1		
		ns.tprint("Batch hack round: " + round + ", exec server: " + ns.getServer().hostname + ", target: " + host)
		while(await isPrepared(ns, host)) {
			var server = ns.getServer()
			var remainingMem = server.maxRam - server.ramUsed
			if(remainingMem >= memNeeded) {
				batchHack(ns, host, delays, batchAnalysis)
			}
			await ns.sleep(batchDelay)
			if(Date.now() - startTime >= oneRoundTimeScale * ns.getWeakenTime(host)) {
				await setPrepared(ns, host, false)
			}
		}
	}

}