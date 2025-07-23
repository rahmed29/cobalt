let innertube = null;

function setInnertube(obj) {
  if (!obj) {
    innertube = null;
  } else {
    innertube = obj;
  }
}

export { innertube, setInnertube };
