export const cols = 30;
export const rows = 20;

export const allPos = (function() {
  const res = [];
  for (var i = 0; i < rows; i++) {
    for (var j = 0; j < cols; j++) {
      res.push([i, j]);
    }
  }
  return res;
})();

export function pos2key(pos) {
  return pos[0] + '.' + pos[1];
};

export function key2pos(key) {
  return key.split('.').map(_ => parseInt(_));
}

const RoleCode = { ' ': 'space',
                   '.': 'gravity',
                   '{': 'leftwall',
                   '}': 'rightwall',
                   '_': 'topwall',
                   'V': 'downspike',
                   'v': 'upspike'
                 };

const Role = {
  space: {
    
  },
  gravity: {
    gravity: true
  },
  leftwall: {
    facing: 'right',
    block: true
  },
  rightwall: {
    facing: 'left',
    block: true
  },
  topwall: {
    facing: 'top',
    block: true
  },
  downspike: {
    kill: true
  },
  upspike: {
    kill: true
  }
};

const levels = [
  `
 ____________________________
{.........vvvvv..............}
{............................}
{..._.................____...}
{............................}
{.._........VV...............}
{                            }
{_                           }
{                            }
{                            }
{                            }
{______VV   V___________vvv  }
{                           _}
{              ______________}
{                            }
{          ____              }
{  ___                       }
{     _____      ____        }
{            _         V     }
{____________________________}
`
];

const makeRole = (function roleMaker() {
  let id = 1;
  return function(roleCode, key) {
    id++;

    const role = RoleCode[roleCode];
    return { id, key, role, ...Role[role] };
  };
})();

export const read = levelStr => {

  const lines = levelStr.split('\n');
  lines.splice(0, 1);
  lines.splice(-1);

  const emptyLine = "                    ";

  while (lines.length < rows) {
    lines.unshift(emptyLine);
  }

  let res = {};
  lines.forEach((line, row) => {
    line = line.split("");

    while (line.length < cols) {
      line.push(" ");
    }
    line.forEach((tileChar, col) => {
      let pos = [row, col];
      res[pos2key(pos)] = {
        role: makeRole(tileChar, pos2key(pos))
      };
    });
  });

  return res;
  
};

export const make = () => {
  return read(levels[0]);
};
