# Cloud Setup

### stw

stw - setup to work

#### Instalation steps

* Clone repository
 `git clone https://github.com/Mamoru1234/Settings.git`
* install required lib `pip install PyYAML`
* Setup permissions
  * For Linux:
    `chmod +x stw`

* Find in path :)
  * For Linux:
    `sudo ln -s $PATH_TO_REPO_FOLDER/stw /usr/local/bin/stw`

#### Commands
Refer to `stw --help` for info.

## Note
You need to setup some properties(like your project path), follow script tips for that.

#### Use without sources
  * stw --download -> Prepare files to start
  * stw --up -> Start cloud
  * stw --down  -> Remove cloud
