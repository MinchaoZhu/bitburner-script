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

function pathSearch(ns, begin, end, path, travalled) {    
    if(begin === end) {
        travalled.push(begin) 
        path.push(begin)  
        return
    } else if(travalled.includes(begin)) {
        return
    } else {       
        travalled.push(begin) 
        path.push(begin)  
        var hosts = ns.scan(begin)
        for (var i = 0; i < hosts.length; i++) { 
            pathSearch(ns, hosts[i], end, path, travalled)
            if(path[path.length - 1] === end) {
                return
            }
        }
        path.pop()
    }
}

export function getPath(ns, begin, end) {
    var path = new Array
    var all = getAllServers(ns)
    if(!all.includes(begin) || !all.includes(end)) {
        return []
    }
    var travalled = new Array   
    pathSearch(ns, begin, end, path, travalled)
    return path
}
