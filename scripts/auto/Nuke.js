/** @param {NS} ns **/

import * as ServerUtils from "/scripts/utils/ServerUtils.js"

function nukeAll(ns) {
	var toolsNum = 0
	var serversWithNoAccess = ServerUtils.getServersWithNoAccess(ns)
	if(ns.fileExists("BruteSSH.exe")) {
		serversWithNoAccess.forEach(
			server => {
				ns.brutessh(server)
			}
		)
		toolsNum = toolsNum + 1
	}

	if(ns.fileExists("FTPCrack.exe")) {
		serversWithNoAccess.forEach(
			server => {
				ns.ftpcrack(server)
			}
		)
		toolsNum = toolsNum + 1
	}

	if(ns.fileExists("relaySMTP.exe")) {
		serversWithNoAccess.forEach(
			server => {
				ns.relaysmtp(server)
			}
		)
		toolsNum = toolsNum + 1
	}

	if(ns.fileExists("HTTPWorm.exe")) {
		serversWithNoAccess.forEach(
			server => {
				ns.httpworm(server)
			}
		)
		toolsNum = toolsNum + 1
	}

	if(ns.fileExists("SQLInject.exe")) {
		serversWithNoAccess.forEach(
			server => {
				ns.sqlinject(server)
			}
		)
		toolsNum = toolsNum + 1
	}

	var myHackingLevel = ns.getHackingLevel()
	serversWithNoAccess.forEach(
		server => {
			if(myHackingLevel >= ns.getServerRequiredHackingLevel(server)
				&& ns.getServerNumPortsRequired(server) <= toolsNum) {
				ns.nuke(server)
				ns.tprint("nuke!!! " + server)
			}
		}
	)
}

export async function main(ns) {
	while(true) {
		nukeAll(ns)
		await ns.sleep(20000)
	}
}