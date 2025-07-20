import shell from "shelljs";

let timeOfLastCycle = Date.now();

function cycleExitNode() {
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
    const ips = list.reduce((prev, e, i, arr) => {
      const ip = e.substring(0, e.indexOf("  ")).trim();
      if (
        ip &&
        ip !== "IP" &&
        !isNaN(parseInt(ip.replaceAll(".", ""))) &&
        ip !== currentExitNode
      ) {
        arr.push(ip);
      }
      return arr;
    }, []);
    if (ips.length === 0) {
      return {
        code: 500,
        msg: `The exit node was not changed because a new exit node could not be found`,
      };
    }
    const newExitNode = ips[Math.floor(Math.random() * ips.length)];
    shell.exec(`tailscale set --exit-node=${newExitNode}`);
    timeOfLastCycle = Date.now();
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
