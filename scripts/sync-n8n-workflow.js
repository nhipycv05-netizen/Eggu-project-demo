const fs = require('fs');
const { execSync } = require('child_process');

const wf = JSON.parse(fs.readFileSync('./workflows/n8n-content-automation.json', 'utf8'))[0];
const nodesJson = JSON.stringify(wf.nodes);
const connectionsJson = JSON.stringify(wf.connections);

fs.writeFileSync('temp_nodes.json', nodesJson);
fs.writeFileSync('temp_connections.json', connectionsJson);

execSync('docker cp temp_nodes.json n8n:/tmp/nodes.json');
execSync('docker cp temp_connections.json n8n:/tmp/connections.json');

const pyScript = `
import sqlite3
import json

with open('/tmp/nodes.json') as f:
    nodes = f.read()
with open('/tmp/connections.json') as f:
    connections = f.read()

conn = sqlite3.connect('/home/node/.n8n/database.sqlite')
cursor = conn.cursor()
cursor.execute('UPDATE workflow_entity SET nodes = ?, connections = ? WHERE id = ?', (nodes, connections, 'C9jxvxQ9K5oCClji'))
conn.commit()
print('Updated rows:', cursor.rowcount)
conn.close()
`;

fs.writeFileSync('temp_update.py', pyScript);
execSync('docker cp temp_update.py n8n:/tmp/update.py');
const out = execSync('docker exec n8n python3 /tmp/update.py').toString();
console.log('Result:', out);

try { fs.unlinkSync('temp_nodes.json'); } catch(e){}
try { fs.unlinkSync('temp_connections.json'); } catch(e){}
try { fs.unlinkSync('temp_update.py'); } catch(e){}
