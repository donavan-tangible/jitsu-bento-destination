# Bento destination for Jitsu

Bento destination plugin for [Jitsu](https://jitsu.com)
based on [Jitsu SDK](https://github.com/jitsucom/jitsu-sdk).

## Using Bento Destination UI
```shell
nano docker-compose.yml
...
services:
    jitsu:
        image: jitsucom/jitsu:tangible <-- TODO: replace with the right path (@Idlar should provide the path soon)
...
```

## Developers  

### Using
Set config.json:
```shell
cp config.json.example config.json
nano config.json
```

Install all dependencies for a project
```shell
yarn install
```

Build destination:
```shell
yarn build
```

Run tests
```shell
yarn test
```

If everything is ok - resulted destination file location
```shell
./dist/bento-destination.js
```

Validate destination config:
with json string:
```shell
yarn validate-config --config-object '{"anonymous": true,"site_key": "1a430bca7ef9c3575a6ef418e92a71d5", "your_integration_name": "jitsu"}'
```
with json file:
```shell
yarn validate-config --config config.json
```

### Setup with CentOS
```shell
docker ps
yum install epel-release
yum install dnf
npm i -g corepack
sudo dnf install nodejs
sudo dnf install npm
npm install -g npx
npx jitsu-cli@0.7.5 extension create --type destination
'''
  Need to install the following packages:
    jitsu-cli@0.7.5
  Ok to proceed? (y) y
  ? Please, provide project name: jitsu-bento
  ? Project directory: /root/application/jitsu-bento
  [info ] - Creating new jitsu project in /root/application/jitsu-bento
  [info ] - Project directory doesn't exist, creating it!
  [info ] - ✨ Done
'''
```

### Settings the plugin with Jitsu server (dev)

```shell
cd /root/application/my-plugins/
tar -C /root/application/my-plugins/jitsu-bento/ -cvzf jitsu-bento-destination.tgz .
mv jitsu-bento-destination.tgz /root/application/my-plugins/jitsu-bento/
```

add this line to "volumes:" section
```shell
nano docker/eventnative.yaml
[...]
destinations:
  jitsu-bento-destination:
    only_tokens:
      - my_token
    type: npm
    package: /home/eventnative/data/plugins/jitsu-bento/jitsu-bento-destination.tgz
    mode: stream
    config:
      api_secret: "https://hooks.slack.com/services/ABC/XYZ/etc"
      token: "registration,error"
      project_id: "123"
```

```
nano docker-compose.yaml
- /root/application/my-plugins/:/home/eventnative/data/plugins/
- /root/application/docker/eventnative.yaml:/home/eventnative/data/config/eventnative.yaml
```

### testing
```bash
yarn build && yarn validate-config -c config.json
```
