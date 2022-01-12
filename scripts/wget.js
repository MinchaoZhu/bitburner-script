/** @param {NS} ns **/
export async function main(ns) {
	var scripts = [ 
					"/scripts/auto/BuyServers.js",
					"/scripts/auto/Hack.js",
					"/scripts/auto/HackRand.js",
					"/scripts/auto/Nuke.js",
					"/scripts/auto/StockGrow.js",
					"/scripts/auto/stopTrade.js",
					"/scripts/auto/stopTradeAndSold.js",
					"/scripts/auto/tradeStocks.js",
					"/scripts/batch_hack/Hack.js",
					"/scripts/batch_hack/PreBatch.js",
					"/scripts/batch_hack/PreBatchForOne.js",
					"/scripts/batch_hack/Start.js",
					"/scripts/exec/allMoney.js",
					"/scripts/exec/CopyScripts.js",
					"/scripts/exec/doGrow.js",
					"/scripts/exec/doHack.js",
					"/scripts/exec/doWeaken.js",
					"/scripts/exec/ForceGrow.js",
					"/scripts/exec/ForceHack.js",
					"/scripts/exec/ForceWeaken.js",
					"/scripts/exec/Grow.js",
					"/scripts/exec/Hack.js",
					"/scripts/exec/HackOne.js",
					"/scripts/exec/HackOneV2.js",
					"/scripts/exec/Info.js",
					"/scripts/exec/RunScriptOnOwned.js",
					"/scripts/exec/StockGrow.js",
					"/scripts/exec/Weaken.js",
					"/scripts/remote/HackRand.js",
					"/scripts/remote/CopyScripts.js",
					"/scripts/stock/tradeOne.js",
					"/scripts/utils/MathUtils.js",
					"/scripts/utils/ServerUtils.js",
					]

	for(var i = 0; i < scripts.length; i++) {
		var urlPrefix = "https://raw.githubusercontent.com/MinchaoZhu/bitburner-script/main"
		var url = urlPrefix + scripts[i]
		await ns.wget(url, scripts[i], "home")
	}
}