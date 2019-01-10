
var is = require("electron-is");

// Mac and Linux have Bash shell scripts (so the following would work)
//        var child = process.spawn('child', ['-l']);
//        var child = process.spawn('./test.sh');       
// Win10 with WSL (Windows Subsystem for Linux)  https://docs.microsoft.com/en-us/windows/wsl/install-win10
//   
// Win10 with Git-Bash (windows Subsystem for Linux) https://git-scm.com/   https://git-for-windows.github.io/
//



function appendOutput(msg) { 
  getCommandOutput().value += (msg+'\n'); 
  getDraggedStuff().value += (msg+'\n'); 
};

function setStatus(msg) { 
  getStatus().innerHTML = msg; 
};

function testADBinstall( {
  
})
// function showOS() {
//     if (is.windows())
//       appendOutput("Windows Detected.")
//     if (is.macOS())
//       appendOutput("Apple OS Detected.")
//     if (is.linux())
//       appendOutput("Linux Detected.")
// }

// https://discuss.atom.io/t/possible-to-get-local-filesystem-path-from-drag-and-drop-file/28858
document.ondragover = document.ondrop = (ev) => {
  ev.preventDefault()
}

document.body.ondrop = (ev) => {
  ev.preventDefault();

  // SOURCE: http://jsfiddle.net/9C2EF/
  // TODO cleanup and refactor
  var files = ev.dataTransfer.files;
  for (var i = 0; i < ev.dataTransfer.files.length ; i++) {
    appendOutput(files[i].name);
  }

  
}


function backgroundProcess() {
    const process = require('child_process');   // The power of Node.JS

    // showOS();
    // var cmd = (is.windows()) ? 'test.bat' : './test.sh';      
    // console.log('cmd:', cmd);
        
    // var child = process.spawn(cmd); 
    // var child = process.spawn('ls', ['-a']);
    var child = process.spawn('adb', ['devices']);

    child.on('error', function(err) {
      appendOutput('ERROR OCCURED: ' + err  );
      if ( err == "Error: spawn adbx ENOENT" ) {
        alert('Looks like you do not have the ADB command installed.  Please do download the Android Studio developer tools and install the ADB command line tool. \n\n'+err);
      } else {
          alert('An error occurred: '+err);
      }
    });

    child.stdout.on('data', function (data) {
      appendOutput(data);
    });

    child.stderr.on('data', function (data) {
      appendOutput('stderr: <'+data+'>' );
    });

    child.on('close', function (code) {
        if (code == 0)
          setStatus('child process complete.');
          // console.log('Another one bites the dust');
        else
          setStatus('child process exited with code ' + code);

        // getCommandOutput().style.background = "DarkGray";
    });
};
