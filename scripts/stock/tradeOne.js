/** @param {NS} ns **/

// config
let bidChance = 0.53
let sellChance = 0.505
let sellLosePercent = 0.1
let sellIncrPercent = 0.3 
let maxRatioOfSumMoney = 0.3
let maxGainedLosePercent = 0.3
let gainedThresh = 0.075
let sellCoolDownRound = 10
let normalCoolDownRound = 2
let coolDownTime = 6000

function getShares(ns, sym) {
	return ns.stock.getPosition(sym)[0]
}

function getAvePrice(ns, sym) {
	return ns.stock.getPosition(sym)[1]
}

function getCost(ns, sym) {
	return getShares(ns, sym) * getAvePrice(ns, sym)
}

function getValue(ns, sym) {
	return getShares(ns, sym) * ns.stock.getBidPrice(sym)
}

function getGained(ns, sym) {
	return getValue(ns, sym) - getCost(ns, sym)
}

// buy decision, return buy share
function buyCheck(ns, sym) {	
	var forecast = ns.stock.getForecast(sym)
	
	if(forecast >= bidChance) {
		var askPrice = ns.stock.getAskPrice(sym)
		var maxMoney = maxRatioOfSumMoney * ns.getPlayer().money
		var maxSharesCanBid = maxMoney / askPrice
		var remainingShares = ns.stock.getMaxShares(sym) - getShares(ns, sym)

		var sharesToBidDecision = Math.min(maxSharesCanBid, remainingShares)
		return sharesToBidDecision
	} else {
		return 0
	}
}

function sellCheck(ns, sym, maxGained) {
	var gainedPercent = getGained(ns, sym) / getCost(ns, sym)
	if(gainedPercent < 0 && Math.abs(gainedPercent) >= sellLosePercent) {
		ns.print("sell for lose percent: " + gainedPercent)
		return getShares(ns, sym)
	}
	if(ns.stock.getForecast(sym) < sellChance) {
		ns.print("sell for low forecase: " + ns.stock.getForecast(sym))
		return getShares(ns, sym)
	}
	if(gainedPercent > 0 && Math.abs(gainedPercent) >= sellIncrPercent) {
		ns.print("sell for gain percent: " + gainedPercent)
		return getShares(ns, sym)
	}
	if(maxGained > 0 && maxGained / getCost(ns, sym) >= gainedThresh) {
		var gainedLosePercent = 1 - getGained(ns, sym) / maxGained;
		if(gainedLosePercent >= maxGainedLosePercent) {
			ns.print("sell for gain lose, maxGained: " + maxGained + ", current gained: " + getGained(ns, sym))
			return getShares(ns, sym)
		}
	}
	return 0
}


function log(ns, sym) {
	var bidPrice = ns.stock.getBidPrice(sym)
	var askPrice = ns.stock.getAskPrice(sym)
	ns.print("Stock:    " + sym)
	ns.print("forecast: " + ns.stock.getForecast(sym))
	ns.print("shares:   " + getShares(ns, sym))
	ns.print("bidPrice: " + bidPrice)
	ns.print("askPrice: " + askPrice)
	ns.print("avePrice: " + getAvePrice(ns, sym))
	ns.print("cost    : " + (getCost(ns, sym)/1000000).toFixed(2) + "m")
	ns.print("value   : " + (getValue(ns, sym)/1000000).toFixed(2) + "m")
	ns.print("gained  : " + (getGained(ns, sym)/1000000).toFixed(2) + "m")
}

export async function main(ns) {
	var sym = ns.args[0]
	ns.print("Auto stock starts for: " + sym)
	
	var maxGained = 0

	while(true) {
		maxGained = Math.max(maxGained, getGained(ns, sym))
		var toSell = 0
		if(getShares(ns, sym) > 0) {
			// hand shares, check whether to sell
			toSell = sellCheck(ns, sym, maxGained)
		} 

		if(toSell > 0) {
			ns.tprint("Stock: [" + sym + "] sold all, gained: " + (getGained(ns, sym)/1000000).toFixed(2) + "m")
			ns.print("sell all, gained:"+ (getGained(ns, sym)/1000000).toFixed(2) + "m")
			ns.stock.sell(sym, toSell)
			await ns.sleep(sellCoolDownRound * coolDownTime)
		} else {
			var toBuy = buyCheck(ns, sym) 
			if(toBuy > 0) {
				ns.stock.buy(sym, toBuy)
			}
		}

		log(ns, sym)
		await ns.sleep(normalCoolDownRound * coolDownTime)
	}
}