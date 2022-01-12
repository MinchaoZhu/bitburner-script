/** @param {NS} ns **/

export async function main(ns) {
}

function scanAll(ns, hostname, result) {
	if(result.includes(hostname) || hostname.startsWith("server-")) {
		return
	}
	result.push(hostname)
	var hosts = ns.scan(hostname)
	for (var i = 0; i < hosts.length; i++) {
		scanAll(ns, hosts[i], result)
	}
}

export function getAllServers(ns) {
	var result = new Array
	scanAll(ns, "home", result)
	return result
}

export function getNukedServers(ns) {
	var all = getAllServers(ns)
	var result = new Array
	for(var i = 0; i < all.length; i++) {
		if (ns.hasRootAccess(all[i]) && all[i] != "home") {
			result.push(all[i])
		}
	}
	return result
}

export function getHackableServers(ns) {
	var all = getNukedServers(ns)
	var result = new Array
	for(var i = 0; i < all.length; i++) {
		if (ns.getServerGrowth(all[i]) >= 5) {
			result.push(all[i])
		}
	}
	return result
}

export function getOwnedServers(ns) {
	return ns.getPurchasedServers()
}

export function getServersWithAccess(ns) {
	var nuked = getNukedServers(ns)
	var owned = getOwnedServers(ns)
	return nuked.concat(owned)
}

export function getServersWithNoAccess(ns) {
	var all = getAllServers(ns)
	var result = new Array
	for(var i = 0; i < all.length; i++) {
		if(!ns.hasRootAccess(all[i])) {
			result.push(all[i])
		}
	}
	return result
}

export function getComputingServers(ns, option) {
	if (option === "home") {
		return ["home"]
	} else if (option === "all") {
		return getOwnedServers(ns).concat(["home"])
	} else {
		return getOwnedServers(ns)
	}
}