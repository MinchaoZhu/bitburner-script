/** @param {NS} ns **/
export async function main(ns) {
	var targetHost = ns.args[0]
		ns.print("host: "+ targetHost + ", force weaken")
		await ns.weaken(targetHost)
}