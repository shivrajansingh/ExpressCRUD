const express = require('express');
const db = express.Router();
const { select, insert, update, remove, createTable, selectWithPagination, count } = require("../helper/sqlite-helper");
const { executeSQL } = require("../config/sqlite")

db.post('/create-table', async (req, res) => {
    try {
      const { tableName, columns } = req.body;
      await createTable(tableName, columns);
      res.json({ message: `Table '${tableName}' created successfully` }); 
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

db.post('/sql', async (req, res) => {
    try {
      const { sql } = req.body;
  
      if (!sql) {
        return res.status(400).json({ error: 'SQL statement is required' });
      }
  
      const result = await executeSQL(sql);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

db.get('/:table/count', async (req, res)=>{
    try{
        const { table } = req.params;
        const condition = req.query;
        const data = await count(table, condition);
        res.json({count : data});
    }catch (error) {
        res.status(500).json({ error: error.message });
      }
})

db.get('/:table', async (req, res)=>{
    try{
        const { table } = req.params;
        const condition = req.query;
        const data = await select(table, condition);
        res.json(data);
    }catch (error) {
        res.status(500).json({ error: error.message });
      }
})

db.get('/:table/:page', async (req, res) => {
    try {
      const { table, page } = req.params;
      const condition = req.query;
      const pageSize = 10; 
      const data = await selectWithPagination(table, condition, parseInt(page), pageSize);
      const totalRecords = await count(table); 
      const totalPages = Math.ceil(totalRecords/10); 
      let finalResponse = {
        data : data, 
        totalRecords : totalRecords,
        totalPages : totalPages
      }
      res.json(finalResponse);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

db.post('/:table', async (req, res) => {
    try {
      const { table } = req.params;
      const data = req.body;
      
      await insert(table, data);
      
      res.json({ message: 'Data inserted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

db.put('/:table', async (req, res) => {
    try {
      const { table } = req.params;
      const { data, condition } = req.body;
      
      await update(table, data, condition);
      
      res.json({ message: 'Data updated successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});
  
db.delete('/:table', async (req, res) => {
  try {
    const { table } = req.params;
    const condition = req.body;
    
    await remove(table, condition);
    
    res.json({ message: 'Data deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = db;