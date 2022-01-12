/** @param {NS} ns **/
export async function main(ns) {
	var targetHost = ns.args[0]

	var maxMoney = ns.getServerMaxMoney(targetHost)
	var threshHold = maxMoney * 0.95


	if (ns.getServerMoneyAvailable(targetHost) < threshHold) {
		var m1 = ns.getServerMoneyAvailable(targetHost)
		ns.print("host: " + targetHost + ", current money: " + m1)
		ns.print("host: " + targetHost + ", target  money: " + threshHold)
		await ns.grow(targetHost)
	}
}