const fs = require('fs');
const sqlite3 = require('/usr/local/lib/node_modules/n8n/node_modules/sqlite3');
const db = new sqlite3.Database('/home/node/.n8n/database.sqlite');
const data = JSON.parse(fs.readFileSync('/tmp/workflow.json', 'utf8'))[0];

db.run(
  'UPDATE workflow_entity SET nodes = ?, connections = ?, updatedAt = datetime(\'now\') WHERE id = ?',
  [JSON.stringify(data.nodes), JSON.stringify(data.connections), data.id],
  function(err) {
    if (err) {
      console.error('Update failed:', err);
      process.exit(1);
    }
    console.log('Successfully updated workflow in n8n database! Rows affected:', this.changes);
  }
);
