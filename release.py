import requests
import urllib
import os
# Kx8y_Dn1EMsysALdenns
from base64 import decodestring
import shutil

BASE_URL = 'https://gitlab.greenwavereality.com/api/v4'
GROUP_NAME = 'riot'
PROJECT_NAME = 'axon-predict'
WORK_PATH = '/home/alexei/temp/git_lab'
BRANCH_NAME = 'master'
FOLDER_NAME = 'riot-cloud/docker-compose'
TOKEN = 'Kx8y_Dn1EMsysALdenns'

headers = {'PRIVATE-TOKEN': TOKEN}

def index_of_first(lst, pred):
    for i,v in enumerate(lst):
        if pred(v):
            return i
    return None

def get_group(group_name):
    response = requests.get(BASE_URL + '/groups', headers = headers)
    response.raise_for_status()
    groups = response.json()
    ind = index_of_first(groups, lambda x: x['name'] == group_name)
    return groups[ind]

def get_group_project(group, project_name):
    response = requests.get(BASE_URL + '/groups/' + str(group['id']) + '/projects', headers = headers)
    response.raise_for_status()
    projects = response.json()
    ind = index_of_first(projects, lambda x: x['name'] == project_name)
    return projects[ind]

def get_meta(project, branch, dst_path, recursive = False):
    path = urllib.quote(dst_path)
    request_data = {'ref': branch, 'path': path, 'recursive': recursive}
    response = requests.get(BASE_URL + '/projects/' + str(project['id']) + '/repository/tree', data = request_data, headers = headers)
    response.raise_for_status()
    files = response.json()
    for riot_file in files:
        print riot_file['path'], riot_file['type']

def upload_file(project, branch, file_path, dst_path):
    request_data = {'ref': branch}
    print 'Uploading file ', file_path, '->', dst_path
    path = urllib.quote(file_path, '')
    response = requests.get(BASE_URL + '/projects/' + str(project['id']) + '/repository/files/' + path, data = request_data, headers = headers)
    response.raise_for_status()
    file_info = response.json()
    with open(dst_path, 'wb') as out_file:
        out_file.write(decodestring(file_info['content']))


def upload_dir(project, branch, src_path, dst_path):
    if not os.path.exists(dst_path):
        raise Exception('dst_path does not exists')
    request_data = {'ref': branch, 'path': src_path}
    response = requests.get(BASE_URL + '/projects/' + str(project['id']) + '/repository/tree', data = request_data, headers = headers)
    response.raise_for_status()
    for file_info in response.json():
        if file_info['type'] == 'tree':
            dir_name = file_info['name']
            new_path = os.path.join(dst_path, dir_name)
            os.mkdir(new_path)
            upload_dir(project, branch, src_path + '/' + dir_name, new_path)
        else:
            file_name = file_info['name']
            upload_file(project, branch, src_path + '/' + file_name, os.path.join(dst_path, file_name))

def process_compose(branch_path):
    with open(os.path.join(branch_path, 'riot-cloud.yml'), 'r') as compose_template:
        with open(os.path.join(branch_path, 'compose.yml'), 'w') as compose:
            for line in compose_template:
                line = line.replace('@version@', '2.1.0-SNAPSHOT')
                compose.write(line)

riot_group = get_group(GROUP_NAME)

riot_project = get_group_project(riot_group, PROJECT_NAME)

if not os.path.exists(WORK_PATH):
    os.mkdir(WORK_PATH)

branch_path = os.path.join(WORK_PATH, BRANCH_NAME)

if os.path.exists(branch_path):
    shutil.rmtree(branch_path)

os.mkdir(branch_path)

upload_dir(riot_project, BRANCH_NAME, FOLDER_NAME, branch_path)
process_compose(branch_path)
