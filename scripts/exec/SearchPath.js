/** @param {NS} ns **/
import * as ServerUtils from "/scripts/utils/ServerUtils.js"

export async function main(ns) {
  var start = ns.args[0]
  var end = ns.args[1]
  var path
  if(end === undefined) {
    path = ServerUtils.getPath(ns, "home", start)
  } else {
    path = ServerUtils.getPath(ns, start, end)
  }
  var output = ""
  
  for(var i = 0; i < path.length; i++) {
    output += path[i] + "->" 
  }
  output = output.substring(0, output.length - 2)
  ns.tprint(output)
}