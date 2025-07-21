let innertube = null;

const setInnertube = (value) => {
  if (!value) {
    innertube = null;
  } else {
    innertube = value;
  }
};

export { innertube, setInnertube };
