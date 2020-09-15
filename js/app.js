import Github from './src/Github.js';

let github = new Github({
  user: 'ethereal97'
  //user: 'laravel'
});

github.repositories.then(repos => {
  let el = document.querySelector('table#repositories');
  if (!el) return;
  
  //console.log(Object.keys(repos[0]));
  let id = 0;
  repos.forEach(repo => {
    let { html_url, name, size, language } = repo;
    id++;
    var tr = document.createElement('tr');        
    var _id = document.createElement('td');        
    var _name = document.createElement('td');
    var _size = document.createElement('td');
    var _lang = document.createElement('td');

    _id.innerText = id;
   
    var a = document.createElement('a');
   
    a.target = '_blank';
    a.href = html_url;
    a.innerText = name;
    
    a.addEventListener('click', function (event) {
      github.getBranch(name).then(res => {
        console.log(res)
      })
      
      return event.preventDefault();
    });
    
    _name.appendChild(a);
    
    _size.innerText = convertSize(size, 'KB', ['KB', 'MB']);
    
    _lang.innerText = language;
    
    tr.appendChild(_id);
    tr.appendChild(_name);
    tr.appendChild(_size);
    tr.appendChild(_lang);
    el.appendChild(tr);
  });
  //* end of getting repositories
});

/**
 * Convert the file size
 * 
 * @param int value
 * @param string unit - [ 'B' | 'KB' | 'MB' | 'GB' ]
 * @param array units
 */
function convertSize(value, unit, units) {
  let size = [];
  let size_in_bytes;
  
  let _units = {
    B: ["bytes", "B", 1],
    KB: ["kilobytes", "KB", 1024],
    MB: ["megabytes", "MB", 1024000],
    GB: ["gigabytes", "GB", 1024000000]
  };
  
  var current_size = _units[unit];
  var current_value = current_size[2];
  
  size_in_bytes = current_value * value;
  
  for (let i in units) {
    unit = units[i];
    var unit_size = _units[unit];
    var unit_value = unit_size[2];
    var repo_size;
    
    if (size_in_bytes > unit_size[2]) {
      if (current_value > unit_value) {
        repo_size = size_in_bytes * unit_value;
      } else {
        repo_size = size_in_bytes / unit_value;
      }
      size.push([repo_size.toFixed(2), unit_size[1]]);
    }
  }
  
  if (size.length < 1) {
    return (size_in_bytes / _units[units[0]][2]).toFixed(2) + ' ' + _units[units[0]][1];
  }
  
  return size.pop().join(' ');
}