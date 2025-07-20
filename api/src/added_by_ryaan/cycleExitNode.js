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
    list.map((e) => {
      if (e.includes("selected")) {
        currentExitNode = e;
      }
    });
    currentExitNode = currentExitNode
      .substring(0, currentExitNode.indexOf("  "))
      .trim();

    const ips = [];
    list.map((e) => {
      const ip = e.substring(0, e.indexOf("  ")).trim();
      if (
        ip &&
        ip !== "IP" &&
        !isNaN(parseInt(ip.replaceAll(".", ""))) &&
        ip != currentExitNode
      ) {
        ips.push(ip);
      }
    });

    const newExitNode = ips[Math.floor(Math.random() * ips.length)];
    if (newExitNode) {
      shell.exec(`tailscale set --exit-node=${newExitNode}`);
      timeOfLastCycle = Date.now();
    } else {
      return {
        code: 500,
        msg: `The exit node was not changed because a new exit node could not be found.`,
      };
    }
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
