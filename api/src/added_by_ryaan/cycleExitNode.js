import shell from "shelljs";

function cycleExitNode() {
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
    shell.exec(`tailscale set --exit-node=${newExitNode}`);
    console.log("Exit node successfully changed.");
    return newExitNode;
  } catch (err) {
    console.error("Could not cycle exit node.");
    return undefined;
  }
}

export default cycleExitNode;
