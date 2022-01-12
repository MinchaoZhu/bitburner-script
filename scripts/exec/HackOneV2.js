/** @param {NS} ns **/
import * as MathUtils from "/scripts/utils/MathUtils.js"

let remainingRatio = 0.25
let doGrowPath = "/scripts/exec/doGrow.js"
let doHackPath = "/scripts/exec/doHack.js"
let doWeakenPath = "/scripts/exec/doWeaken.js"

function getCurrentFilledRatio(ns, target) {
	return ns.getServerMoneyAvailable(target) / ns.getServerMaxMoney(target)
}

function doHack(ns, target, threads, delay) {
	if(threads > 0) {
		ns.run(doHackPath, threads, target, delay, MathUtils.getRandInt())
	}
}

function doGrow(ns, target, threads, delay) {
	if(threads > 0) {
		ns.run(doGrowPath, threads, target, delay, MathUtils.getRandInt())
	}
}

function doWeaken(ns, target, threads,delay) {
	if(threads > 0) {
		ns.run(doWeakenPath, threads, target, delay, MathUtils.getRandInt())	
	}
}

async function preGrow(ns, target) {
	var currentFilledRatio = getCurrentFilledRatio(ns, target)
	currentFilledRatio = currentFilledRatio == 0 ? 0.000001 : currentFilledRatio;
	if(remainingRatio > currentFilledRatio) {
		var growThreads = ns.growthAnalyze(target, remainingRatio/currentFilledRatio, 1)
		doGrow(ns,target, 1024, 0)
	}
}

async function preWeaken(ns, target) {
	if (ns.getServerSecurityLevel(target) >= 50) {
		doWeaken(ns, target, 1024, 0)
	}
}

function analyzeHack(ns, target) {
	var oneThreadHackPercent = ns.hackAnalyze(target)
	oneThreadHackPercent = oneThreadHackPercent == 0 ? 0.75 : oneThreadHackPercent

	var hackThreads = (1.0 - remainingRatio) / oneThreadHackPercent
	var hackTime = ns.getHackTime(target)
	var hackSecurityLevel = ns.hackAnalyzeSecurity(hackThreads)
	// ns.tprint("hack threads:   " + hackThreads)
	// ns.tprint("hack time:      " + hackTime)
	// ns.tprint("hack security:  " + hackSecurityLevel)

	return {
		threads: hackThreads,
		time: hackTime,
		securityLevel: hackSecurityLevel,
	}
}

function analyzeGrow(ns, target) {
	var currentFilledRatio = getCurrentFilledRatio(ns, target)
	currentFilledRatio = currentFilledRatio == 0 ? 0.0001 : currentFilledRatio;
	var growThreads = ns.growthAnalyze(target, 1/currentFilledRatio, 1)
	growThreads = isFinite(growThreads) ? 1024 : growThreads

	var growTime = ns.getGrowTime(target)
	var growSecurityLevel = ns.hackAnalyzeSecurity(growThreads)
	// ns.tprint("grow threads:   " + growThreads)
	// ns.tprint("grow time:      " + growTime)
	// ns.tprint("grow security:  " + growSecurityLevel)

	return {
		threads: growThreads,
		time: growTime,
		securityLevel: growSecurityLevel,
	}
}

function analyzeWeaken(ns, target, extraSecurityLevel) {
	var currentSecurityLevel = ns.getServerSecurityLevel(target)
	var futureSecurityLevel = currentSecurityLevel + extraSecurityLevel
	var securityLevelToBeDecreased = futureSecurityLevel - ns.getServerMinSecurityLevel(target)
	var weakenThreads = securityLevelToBeDecreased / ns.weakenAnalyze(1)
	var weakenTime = ns.getWeakenTime(target)
	// ns.tprint("weaken threads:  " + weakenThreads)
	// ns.tprint("weaken time:     " + weakenTime)

	return {
		threads: weakenThreads,
		time: weakenTime,
	}
}


function getActionDelay(ns, growTime, hackTime, weakenTime) {
	// finished time: grow <= hack <= weaken
	var delays = [0, 0, 0]

	if(hackTime < growTime) {
		delays[1] = growTime - hackTime + 1000
	}

	if(weakenTime < hackTime + delays[1]) {
		delays[2] = hackTime + delays[1] - weakenTime + 1000 
	}

	// ns.tprint("delay after grow runned: " + delays[1])
	// ns.tprint("delay after hack runned: " + delays[2])

	return delays
}

function getActionThreads(ns, growThreads, hackThreads, weakenThreads) {
	var growMem = ns.getScriptRam(doGrowPath) * growThreads
	var hackMem = ns.getScriptRam(doHackPath) * hackThreads
	var weakenMem = ns.getScriptRam(doWeakenPath) * weakenThreads
	var sum = growMem + hackMem + weakenMem

	var host = ns.getHostname()
	var availRam = ns.getServerMaxRam(host) - ns.getServerUsedRam(host)
	var ratio = (availRam > sum) ? 1.0 : (sum / availRam)

	return {
		growThreads: growThreads * ratio,
		hackThreads: hackThreads * ratio,
		weakenThreads: weakenThreads * ratio,
	}
}



export async function main(ns) {
	var target = ns.args[0]
	// ns.print("target: " + target)

	await preGrow(ns, target)

	var growAnalyzeResult = analyzeGrow(ns, target)
	var growThreads = growAnalyzeResult.threads
	var growTime = growAnalyzeResult.time
	var growSecurityLevel = growAnalyzeResult.securityLevel

	var hackAnalyzeResult = analyzeHack(ns, target)
	var hackThreads = hackAnalyzeResult.threads
	var hackTime = hackAnalyzeResult.time
	var hackSecurityLevel = hackAnalyzeResult.securityLevel

	var weakenAnalyzeResult = analyzeWeaken(ns, target, growSecurityLevel + hackSecurityLevel)
	var weakenThreads = weakenAnalyzeResult.threads
	var weakenTime = weakenAnalyzeResult.time

	var actionDelay = getActionDelay(ns, growTime, hackTime, weakenTime)
	var actionThreads = getActionThreads(ns, growThreads, hackThreads, weakenThreads)

	// ns.tprint("grow threads: " + Math.ceil(actionThreads.growThreads))
	// ns.tprint("hack threads: " + Math.ceil(actionThreads.hackThreads))
	// ns.tprint("weaken threads: " + Math.ceil(actionThreads.weakenThreads))

	doGrow(ns, target, Math.ceil(actionThreads.growThreads), actionDelay[0])
	doHack(ns, target, Math.ceil(actionThreads.hackThreads), actionDelay[1])
	doWeaken(ns, target, Math.ceil(actionThreads.weakenThreads), actionDelay[2])

}