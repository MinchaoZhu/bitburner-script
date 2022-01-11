# bitburner-script
bitburner-script

## structures
- scripts

    |-- auto        # auto run script, daemon scripts

    |-- exec        # one-time run script 
    
    |-- stock       # stock relative
    
    |-- utils       # helper utils
    
## Usage
 In **game**'s terminal
### Init
1. Download initial script

```bash
wget "https://raw.githubusercontent.com/MinchaoZhu/bitburner-script/main/scripts/wget.ns" wget.ns
```

2. Download all scripts

```bash
run wget.ns"
```

3. alias

```bash
alias nuke="run /scripts/auto/Nuke.ns"

alias hackRand="run /scripts/auto/HackRand.ns"

alias boom="run /scripts/remote/HackRand.ns"

alias autoBuy="run /scripts/auto/BuyServers.ns"

alias stock="run /scripts/auto/tradeStocks.ns"

alias stopStock="run scripts/auto/stopTrade.ns"

alias soldStock="run scripts/auto/stopTradeAndSold.ns"

alias money="run scripts/exec/allMoney.ns"

alias hackOne="run scripts/auto/Hack.ns"

alias preBatch="run /scripts/remote/PreBatch.ns"

alias copyScripts="run scripts/remote/CopyScripts.ns"

alias info="run /scripts/exec/Info.ns"

alias BatchHack="run /scripts/batch_hack/Start.js"
```
### Commands
1. nuke
Auto-nuke all servers continuously according your hacking level and owned xxx.exe

2. hackRand
The server running it will randomly hacking all nuked servers continuously.

Attention: will c.ns"ume **all** memory

3. autoBuy [targetRam]
Continuously auto-buy and upgrade purchased servers util all purchased servers' ram reachs targetRam. The server name in format 
```
server-{ram}-{index}
```
ram is 128, 512, 1024, ...
index is 0, 1, 2, ..., 24

4. boom

On all purchased servers, hackRand is runned. That me.ns" all purchased servers will help you to hack money

5. stock

Auto trade stocks.

6. stopStock

Stop auto trading but no stock share will be sold.

7. soldStock

Stop auto trading and all stock shares will be sold.

8. money

Print your cash and stock value.

9. info [host]

Print host info

10. preBatch

Weaken and grow all hackable servers util they are in min sercurity level and max money. The working scripts are running on purchased server.

11. copyScripts

Copy scripts folder into all purchased servers.

12. batchHack {start/stop} {1/home/all}

Auto batch hack on purchased server or home or all servers.
