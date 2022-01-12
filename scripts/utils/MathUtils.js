/** @param {NS} ns **/
export async function main(ns) {

}

export function getRandInt(ns) {
	return Math.floor((Math.random() * Date.now()) % 2147483647);
}