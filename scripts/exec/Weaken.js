/** @param {NS} ns **/
export async function main(ns) {
	var targetHost = ns.args[0]
	var minSecurityLevel = ns.getServerMinSecurityLevel(targetHost)
	var threshHold = minSecurityLevel * 1.1

	if (ns.getServerSecurityLevel(targetHost) > threshHold) {
		ns.print("host: "+ targetHost + ", current safelevel: " + ns.getServerSecurityLevel(targetHost))
		ns.print("host: "+ targetHost + ", target  safelevel: " + threshHold)
		await ns.weaken(targetHost)
	}
}