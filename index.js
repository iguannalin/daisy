window.addEventListener("load", () => {
  // traverse row
  // traverse col 
  // find matches for row col
  // for each match, validate if exists in dictionary with row and col

  let dictionary = {};
  let phrases = [];
  let puzzle;
  let pIndex = -1;

  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
  }

  function getRandomWord() {
    if (phrases.length < 1) phrases = Object.keys(dictionary).filter((key) => key.length == 4);
    // console.log(phrases);
    // const randomKey = Object.keys(dictionary)[getRandomInt(0, Object.keys(dictionary).length)];
    // return dictionary[randomKey][getRandomInt(0, dictionary[randomKey].length)];
    pIndex+=1;
    return phrases[pIndex];
  }

  function solve(grid, r, c) {
    console.log(grid);
    if (r < 3 && c > 3) { r += 1; c = 0 };
    if (r == 3 && c > 3) return grid;
    let rowStr = grid[r];
    let colStr = "";
    grid.forEach((row) => colStr += row[c] ? row[c] : "");

    let result = null;

    if (rowStr && dictionary[rowStr]) {
      for (let i = 0; i < dictionary[rowStr].length; i++) {
        let match = dictionary[rowStr][i];
        if (dictionary[colStr]?.includes(colStr+match[match.length-1])) {
          grid[r] = match;
          let res = solve(grid, r, c+1);
          if (res) return res;
        }
      }
    } else if (colStr && dictionary[colStr]) {
      for (let i = 0; i < dictionary[colStr].length; i++) {
        let match = dictionary[colStr][i];
        grid[r] = match[r];
        let res = solve(grid, r, c+1);
        if (res) return res;
      }
    }
    return result;
  }

  function getPuzzle() {
    let starter = "";
    while (starter.length != 4) starter = getRandomWord();
    return solve([starter,"","",""], 1, 0);
  }

  function onType(e) {
    let [r, c] = e.target.id.split("-");
    if (e.target.value && e.target.value != puzzle[r][c]) e.target.classList = "red";
    else e.target.classList.remove("red");
  }

  const grid = document.getElementById("grid");
  function initGrid(puzzle) {
    const chance = (Math.random() > 0.5);
    for (let i = 0; i < 4; i++) {
      const tr = document.createElement("tr");
      puzzle[i].split("").forEach((letter, j) => {
        const td = document.createElement("td");
        if (chance && ((i == 0 && j == 0) || (i == 1 && j == 1) || (i == 2 && j == 2) || (i == 3 && j == 3))) {
          td.innerHTML = letter;
        } else if (!chance && ((i == 0 && j == 0) || (i == 0 && j == 3) || (i == 3 && j == 0) || (i == 3 && j == 3))) {
          td.innerHTML = letter;
        } else {
          td.innerHTML = `<input type='text' id=${i}-${j} maxlength='1'></input>`;
          td.oninput = onType;
        }
        tr.appendChild(td);
      })
      grid.appendChild(tr);
    }
  }

  // amazing chengyu data source -- http://thuocl.thunlp.org/
  fetch("dictionary.json").then((f) => f.json()).then((r) => {
    dictionary = r;
    let count = 0; // for the really bad luck
    puzzle = getPuzzle();
    while ((!puzzle || puzzle[3]?.length < 4) && pIndex < phrases.length-1) {
      puzzle = getPuzzle();
      count++;
    }
    if (puzzle) {
      initGrid(puzzle);
    } else {
      const p = document.createElement("a");
      p.innerHTML = "refresh";
      p.href = "javascript:window.location.reload(true);";
      document.getElementById("container").appendChild(p);
    }
    console.log("Solved: ", puzzle, count);
  });
});