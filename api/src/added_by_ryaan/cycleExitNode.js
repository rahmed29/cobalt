import shell from "shelljs";
import { setInnertube } from "./innertube.js";

let timeOfLastCycle = Date.now();
let switching = false;

async function cycleExitNode() {
  if (switching) {
    return {
      code: 503,
      msg: "The exit node was not changed because it is currently being changed",
    };
  }
  if (Date.now() - timeOfLastCycle <= 5000) {
    return {
      code: 429,
      msg: "The exit node was not changed because it was changed too recently",
    };
  }

  try {
    switching = true;
    const list = shell.exec("tailscale exit-node list").split("\n");
    let currentExitNode = undefined;
    list.forEach((e) => {
      if (e.includes("selected")) {
        currentExitNode = e.substring(0, e.indexOf("  ")).trim();
      }
    });
    const ips = [];
    list.forEach((e) => {
      const ip = e.substring(0, e.indexOf("  ")).trim();
      if (
        ip &&
        ip !== "IP" &&
        !isNaN(parseInt(ip.replaceAll(".", ""))) &&
        ip !== currentExitNode
      ) {
        ips.push(ip);
      }
    });
    if (ips.length === 0) {
      switching = false;
      return {
        code: 500,
        msg: `The exit node was not changed because a new exit node could not be found`,
      };
    }
    const newExitNode = ips[Math.floor(Math.random() * ips.length)];
    shell.exec(`tailscale set --exit-node=${newExitNode}`);
    timeOfLastCycle = Date.now();

    let response = null;
    let ip = "---.---.---.---";
    try {
      response = await fetch("https://ipv4.icanhazip.com/");
      ip = await response.text();
    } catch (err) {
      try {
        response = await fetch("https://checkip.amazonaws.com/");
        ip = await response.text();
      } catch (err) {}
    }
    switching = false;
    setInnertube();

    return {
      code: 200,
      msg: `The exit node was changed to ${newExitNode}. The outside world will see your IP as ${ip.trim()}`,
    };
  } catch (err) {
    switching = false;
    return {
      code: 500,
      msg: `The exit node was not changed because an error occurred: ${err.message}`,
    };
  }
}

export default cycleExitNode;
