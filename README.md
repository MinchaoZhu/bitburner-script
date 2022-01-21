# bitburner-script
bitburner-script

## structures
- scripts

    |-- auto        # auto run script, daemon scripts
    
    |-- batchHack   # batch hack relative

    |-- exec        # one-time run script 
    
    |-- stock       # stock relative
    
    |-- utils       # helper utils
    
## Usage
 In **game**'s terminal
 
 在游戏里面的 terminal 中
### Init
1. Download initial script

下载初始脚本

```bash
wget "https://raw.githubusercontent.com/MinchaoZhu/bitburner-script/main/scripts/wget.js" wget.js
```

2. Download all scripts

下载所有脚本

```bash
run wget.js
```

3. alias

设置快捷命令

```bash
alias nuke="run /scripts/auto/Nuke.js";

alias hackRand="run /scripts/auto/HackRand.js";

alias boom="run /scripts/remote/HackRand.js";

alias autoBuy="run /scripts/auto/BuyServers.js";

alias stock="run /scripts/auto/tradeStocks.js";

alias stopStock="run /scripts/auto/stopTrade.js";

alias soldStock="run /scripts/auto/stopTradeAndSold.js";

alias money="run /scripts/exec/allMoney.js";

alias hackOne="run /scripts/auto/Hack.js";

alias preBatch="run /scripts/remote/PreBatch.js";

alias copyScripts="run /scripts/remote/CopyScripts.js";

alias info="run /scripts/exec/Info.js";

alias BatchHack="run /scripts/batch_hack/Start.js";

alias hack="run /scripts/batch_hack/Hack.js";

alias path="run /scripts/exec/SearchPath.js";
```
### Commands
1. ```nuke```

根据 hack 等级和拥有的 xxx.exe 自动 nuke 服务器.

Auto-nuke all servers continuously according your hacking level and owned xxx.exe

2. ```hackRand```

The server running it will randomly hacking all nuked servers continuously.

Attention: will consume **all** memory

3. ```autoBuy <targetRam>```

自动购买服务器, 参数为目标内存.

Continuously auto-buy and upgrade purchased servers util all purchased servers' ram reachs targetRam. The server name in format 
```
server-{ram}-{index}
```

ram is 128, 512, 1024, ...

index is 0, 1, 2, ..., 24

4. ```boom```

On all purchased servers, hackRand is runned. That me.ns" all purchased servers will help you to hack money

5. ```stock```

Auto trade stocks.

6. ```stopStock```

Stop auto trading but no stock share will be sold.

7. ```soldStock```

Stop auto trading and all stock shares will be sold.

8. ```money```

Print your cash and stock value.

9. ```info <host>```

展示目标主机的信息

Print host info

10. ```preBatch```

Weaken and grow all hackable servers util they are in min sercurity level and max money. The working scripts are running on purchased server.

11. ```copyScripts```

复制所有脚本到购买的服务器上

Copy scripts folder to all purchased servers.

12. ```batchHack <start|stop> <1|home|all>```

Start or stop batch hack on purchased server or home or all servers.

```1```: on only purchased servers

```home```: on only home server

```all```: on both home and purchased servers

13. ```hack <host>```

在本地主机上用 batch hack 入侵特定的服务器

Hack host on current server using batch-hack methods.

14. ```path <start?> <end>```

查找从起点服务器到终点服务器的路线. 如果只有一个参数, 则为 "home" 到终点服务器的路线

Search net path from start to end.

Start will be "home" if there is no arg `start`.
