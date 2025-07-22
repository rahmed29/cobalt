import shell from "shelljs";

let timeOfLastCycle = Date.now();

async function cycleExitNode() {
  if (Date.now() - timeOfLastCycle <= 5000) {
    return {
      code: 429,
      msg: "The exit node was not changed because it was changed too recently",
    };
  }
  try {
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
      return {
        code: 500,
        msg: `The exit node was not changed because a new exit node could not be found`,
      };
    }
    const newExitNode = ips[Math.floor(Math.random() * ips.length)];
    shell.exec(`tailscale set --exit-node=${newExitNode}`);
    timeOfLastCycle = Date.now();

    let response = null;
    let ip = "";
    try {
      response = await fetch("https://ipv4.icanhazip.com/");
      ip = await response.text();
    } catch (err) {
      try {
        response = await fetch("https://checkip.amazonaws.com/");
        ip = await response.text();
      } catch (err) {}
    }
    console.log(ip.trim());

    return {
      code: 200,
      msg: `The exit node was changed to ${newExitNode}`,
    };
  } catch (err) {
    return {
      code: 500,
      msg: `The exit node was not changed because an error occurred: ${err.message}`,
    };
  }
}

export default cycleExitNode;
