/** @param {NS} ns **/
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


export async function main(ns) {
	buyServer(ns, ns.args[0], ns.args[1])
}