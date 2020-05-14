#!/bin/bash

echo "Downloading daemon..."
wget -O eris http://10.0.0.206:5000/api/downloadDaemon
chmod +x eris
echo "Installing daemon..."
mv ./eris /opt/eris
cat > /etc/systemd/system/eris.service <<- EOM
[Unit]
Description=Eris daemon service
After=network.target
StartLimitIntervalSec=0
[Service]
Type=simple
Restart=always
RestartSec=1
User=root
ExecStart=/opt/eris

[Install]
WantedBy=multi-user.target
EOM

mount -o remount,strictatime /

systemctl start eris
systemctl enable eris
echo "Daemon Installed."
