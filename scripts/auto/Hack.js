/** @param {NS} ns **/
import * as MathUtils from "/scripts/utils/MathUtils.js"

export async function main(ns) {
	var server = ns.args[0]
	while(true) {
		ns.run("/scripts/exec/HackOneV2.js", 1, server, MathUtils.getRandInt())
		await ns.sleep(10)
	}
}