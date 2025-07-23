async function fetchCycleExitNode(url) {
  try {
    await fetch(`${url.substring(0, url.indexOf("/tunnel"))}/cycle-exit-node`, {
      method: "GET",
    });
  } catch (err) {
    console.error("Error when contacting `/cycle-exit-node` endpoint" + err);
  }
}

export default fetchCycleExitNode;
