const { query, executeSQL } = require('../config/sqlite');

async function select(tableName, conditions = {}) {
    try {
      let queryStr = `SELECT * FROM ${tableName}`;
      let valuesForWhereClause = [];
      let sortOrder = 'ASC';
      let orderBy = 'id'; // Default to ordering by 'id'
      let limit = 1000; // Default limit
  
      if (Object.keys(conditions).length > 0) {
        const whereClause = Object.keys(conditions)
          .filter(key => key !== 'sort' && key !== 'orderBy' && key !== 'limit') // Exclude 'sort', 'orderBy', and 'limit' from where clause
          .map(key => `${key} = ?`)
          .join(' AND ');
        valuesForWhereClause = Object.values(conditions).filter(value => value !== 'asc' && value !== 'desc' && value !== conditions.orderBy && value !== conditions.limit);
        
        if (whereClause) {
          queryStr += ` WHERE ${whereClause}`;
        }
        
        // Check for sort condition
        if (conditions.sort && (conditions.sort.toLowerCase() === 'asc' || conditions.sort.toLowerCase() === 'desc')) {
          sortOrder = conditions.sort.toUpperCase();
        }
  
        // Check for orderBy condition
        if (conditions.orderBy) {
          orderBy = conditions.orderBy;
        }
  
        // Check for limit condition
        if (conditions.limit) {
            const parsedLimit = parseInt(conditions.limit, 10);
            if (!isNaN(parsedLimit) && parsedLimit > 0) {
              limit = parsedLimit;
            }
        }
      }
  
      // Append ORDER BY clause
      queryStr += ` ORDER BY ${orderBy} ${sortOrder}`;
  
      // Append LIMIT clause
      queryStr += ` LIMIT ${limit}`;
      const rows = await query(queryStr, valuesForWhereClause);
      
      return rows;
    } catch (error) {
      throw new Error(`Error selecting from database: ${error.message}`);
    }
}
  
async function selectWithPagination(tableName, conditions = {}, page = 1, pageSize = 10) {
    try {
      let queryStr = `SELECT * FROM ${tableName}`;
      let valuesForWhereClause = [];
      let sortOrder = 'ASC';
      let orderBy = 'id'; // Default to ordering by 'id'
  
      if (Object.keys(conditions).length > 0) {
        const whereClause = Object.keys(conditions)
          .filter(key => key !== 'sort' && key !== 'orderBy' && key !== 'limit') // Exclude 'sort', 'orderBy', and 'limit' from where clause
          .map(key => `${key} = ?`)
          .join(' AND ');
        valuesForWhereClause = Object.values(conditions).filter(value => value !== 'asc' && value !== 'desc' && value !== conditions.orderBy && value !== conditions.limit);
        
        if (whereClause) {
          queryStr += ` WHERE ${whereClause}`;
        }
        
        // Check for sort condition
        if (conditions.sort && (conditions.sort.toLowerCase() === 'asc' || conditions.sort.toLowerCase() === 'desc')) {
          sortOrder = conditions.sort.toUpperCase();
        }
  
        // Check for orderBy condition
        if (conditions.orderBy) {
          orderBy = conditions.orderBy;
        }
  
        // Check for limit condition and validate it
        if (conditions.limit) {
          const parsedLimit = parseInt(conditions.limit, 10);
          if (!isNaN(parsedLimit) && parsedLimit > 0) {
            pageSize = parsedLimit;
          }
        }
      }
  
      const offset = (page - 1) * pageSize;
      queryStr += ` ORDER BY ${orderBy} ${sortOrder}`; 
      queryStr += ` LIMIT ${pageSize} OFFSET ${offset}`;
  
      const rows = await query(queryStr, valuesForWhereClause);
      
      return rows;
    } catch (error) {
      throw new Error(`Error selecting from database: ${error.message}`);
    }
}

async function insert(tableName, data) {
  try {
    const columns = Object.keys(data).join(', ');
    const values = Object.values(data);

    const queryStr = `INSERT INTO ${tableName} (${columns}) VALUES (${values.map(() => '?').join(', ')})`;
    const result = await query(queryStr, values);
    
    return result.lastID;
  } catch (error) {
    throw new Error(`Error inserting into database: ${error.message}`);
  }
}

async function update(tableName, data, conditions = {}) {
  try {
    const columnsToUpdate = Object.keys(data)
      .map(key => `${key} = ?`)
      .join(', ');
    const valuesToUpdate = Object.values(data);
    const whereClause = Object.keys(conditions)
      .map(key => `${key} = ?`)
      .join(' AND ');
    const valuesForWhereClause = Object.values(conditions);

    const queryStr = `UPDATE ${tableName} SET ${columnsToUpdate} WHERE ${whereClause}`;
    const result = await query(queryStr, [...valuesToUpdate, ...valuesForWhereClause]);
    
    return result.changes; // SQLite specific: returns the number of affected rows
  } catch (error) {
    throw new Error(`Error updating database: ${error.message}`);
  }
}

async function remove(tableName, conditions = {}) {
  try {
    const whereClause = Object.keys(conditions)
      .map(key => `${key} = ?`)
      .join(' AND ');
    const valuesForWhereClause = Object.values(conditions);

    const queryStr = `DELETE FROM ${tableName} WHERE ${whereClause}`;
    const result = await query(queryStr, valuesForWhereClause);
    
    return result.changes; // SQLite specific: returns the number of affected rows
  } catch (error) {
    throw new Error(`Error deleting from database: ${error.message}`);
  }
}

async function count(tableName, conditions = {}) {
  try {
    // Construct the SQL query to count records
    let queryStr = `SELECT COUNT(*) AS count FROM ${tableName}`;
    let valuesForWhereClause = [];

    if (Object.keys(conditions).length > 0) {
      const whereClause = Object.keys(conditions)
        .map(key => `${key} = ?`)
        .join(' AND ');
      valuesForWhereClause = Object.values(conditions);
      queryStr += ` WHERE ${whereClause}`;
    }

    // Execute the query to count records
    const rows = await query(queryStr, valuesForWhereClause);
    const count = rows[0].count;
    return count;
  } catch (error) {
    throw new Error(`Error getting count from database: ${error.message}`);
  }
}

async function createTable(tableName, columns) {
  const columnDefinitions = Object.entries(columns).map(([columnName, columnType]) => {
    return `${columnName} ${columnType}`;
  });

  const sql = `CREATE TABLE IF NOT EXISTS ${tableName} (${columnDefinitions.join(', ')})`;
  
  try {
    await query(sql);
    console.log(`Table '${tableName}' created successfully.`);
  } catch (error) {
    console.error(`Error creating table '${tableName}':`, error);
  }
}



module.exports = { select, insert, update, remove, createTable, selectWithPagination, count };
