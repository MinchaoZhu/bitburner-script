/** @param {NS} ns **/
export async function main(ns) {
	var target = ns.args[0]
	var scripts = ns.ls("home", "/scripts")
	ns.scp(scripts, "home", target)
}