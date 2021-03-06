/** @param {NS} ns **/
import * as ServerUtils from "/scripts/utils/ServerUtils.js"

function getServerName(ram, index) {
	// server-4-24 
	// server-{ram}-{index}
    return "server-" + ram + "-" + index 
}

function buyServer(ns, ram, index) {
    var serverName = getServerName(ram, index)
	if(ns.purchaseServer(serverName, ram) != "") {
    	ns.tprint("New server: " + serverName)
	}
}

function buyFilledServers(ns) {
    for(var i = 0; i < ns.getPurchasedServerLimit(); i++) {
		buyServer(ns, 64, i)
	}
}

function scanAndBuy(ns, targetRam) {
    var servers = ServerUtils.getOwnedServers(ns);
    var delimiter = '-'
    var maxRam = 0;
    var maxIndex = -1;

    for(var i = 0; i < servers.length; i++) {
        var serverName = servers[i]
        var props = serverName.split(delimiter)
        var currRam = parseInt(props[1])
        if(currRam == maxRam) {
            maxIndex = Math.max(maxIndex, parseInt(props[2]))
        } else if(currRam > maxRam) {
            maxIndex = parseInt(props[2])
            maxRam = currRam
        }
    }

    var nextRam = 0
    var nextIndex = 0

    if(maxIndex < servers.length - 1) {
        nextRam = maxRam
        nextIndex = maxIndex + 1
    } else if (maxIndex == servers.length - 1) {
        nextRam = 2 * maxRam
        nextIndex = 0
    }

	if(nextRam > targetRam) {
		return 0
	}

    if(ns.getPurchasedServerCost(nextRam) < 0.75 * ns.getPlayer().money) {
        var oldServer = getServerName(nextRam / 2, nextIndex)
        ns.tprint("Old server: " + oldServer)
		ns.killall(oldServer)
        ns.deleteServer(oldServer)
        buyServer(ns, nextRam, nextIndex)
    }
	
	return 1
}

export async function main(ns) {
	buyFilledServers(ns)
	var targetRam = ns.args[0]
    while(scanAndBuy(ns, targetRam)) {
		await ns.sleep(200)
    }
}