let s1 = sequenceCommand("+");
let s2 = sequenceCommand("-");

function brainfuck_to_c(sc) {
  console.log(sc);
  let a = sc;
  let b;
  a = a.replace(/\s|[^+-<>.,\[\]]/gi, "");
  a = a.replace(/\+\-|<>|><|\[\]/gi, "");
  a = bracket(a);
  a = command(a, ".");
  a = command(a, ",");
  a = s1(a);
  a = s2(a);
  //Your code
  return a;
}

function sequenceCommand(type) {
  let regex = type === "+" ? /[-]+|[+]+|([+-])\1+/ : /[<]+|[>]+|([<>])\1+/;
  return function(str) {
    let s = str;
    let r = new RegExp(regex, "g");
    let prefix = type === "+" ? "*" : "";
    let match;
    while ((match = r.exec(s)) !== null) {
      let l = match[0].length;
      let x = match[0];
      let operator = x[0] === "+" || x[0] === ">" ? "+" : "-";
      let replacer = prefix + `p ${operator}= ${l};\n`;
      s = s.replace(x, replacer);
      r.lastIndex += replacer.length - l;
    }
    return s;
  };
}

function command(str, type) {
  let replacer = type === "." ? "putchar(*p);\n" : "*p = getchar();\n";
  let regex = type === "." ? /\./g : /\,/g;
  let s = str;
  return str.replace(regex, replacer);
}

function bracket(str) {
  let s = str;
  let i = 0;
  let c = 0;
  while (s[i]) {
    if (s[i] === "]") c--;
    if (c > 0) {
      let s1 = s.slice(0, i);
      let s2 = s.slice(i);
      let s3 = "";
      for (let j = 0; j < c; j++) {
        s3 += "?";
        i++;
      }
      s = s1 + s3 + s2;
      while (s[i] === s[i + 1] && s[i] !== "]") {
        i++;
      }
    }
    if (s[i] === "[" && c < 0) return "Error!";
    if (s[i] === "[") c++;
    i++;
  }
  if (c !== 0) return "Error!";
  s = s.replace(/\?/g, "  ");
  s = s.replace(/\[/g, "if (*p) do {\n");
  s = s.replace(/\]/g, "} while (*p);\n");
  return s;
}
