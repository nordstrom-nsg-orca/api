const validate = require('jsonschema').validate;
const map = require('./dataTypeMap.js');

// queries the psql metadata to get column information to build jsonschema
module.exports.build = async (client, table, action) => {
  const query = `
  SELECT col.column_name, col.is_nullable, col.data_type,
    COALESCE(pk.constraint_name, '') as constraint_name
  FROM information_schema.columns as col
  LEFT JOIN (
    SELECT table_name, column_name, constraint_name
    FROM information_schema.constraint_column_usage
    WHERE constraint_name NOT LIKE '%fkey'
  ) pk ON pk.column_name = col.column_name AND pk.table_name = col.table_name
  WHERE col.table_name = $1`;
  const values = [table];

  let res;
  try {
    res = await client.query(query, values);
    console.log(res.rows);
  } catch (err) {
    return {
      err: err
    }
  }

  let schema = {
    "id": `${table}-${action}`,
    "type": "object",
    "properties": {},
    "required": []
  }

  for (let i = 0; i < res.rows.length; i++) {
    let r = res.rows[i];

    // skips the primary key, since it is autogenerated
    if (r.constraint_name.slice(-4) === 'pkey') {

      // the pkey is required on updates
      if (action === 'update') {
        if (r.column_name === 'id') continue;
        schema.properties[r.column_name] = {
          "type": map[r.data_type]
        }
        schema.required.push(r.column_name);
      }
      continue;
    }

    schema.properties[r.column_name] = {
      "type": map[r.data_type]
    }

    // NOT NULLs only required on creation
    if (r.is_nullable === 'NO' && action === 'create')
      schema.required.push(r.column_name)
  }
  return schema;
}

module.exports.validate = (event, schema) => {

  const valid = validate(event, schema);
  let errs = null;

  if (!valid.valid) {
    errs = [];
    for (var i = 0; i < valid.errors.length; i++)
      errs.push(valid.errors[i].message);
  }

  return {
    valid: valid.valid,
    errs: errs
  }
}
