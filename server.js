import express from 'express';
import mysql from 'mysql';
import cors from 'cors';

const app = express();
const port = 3000;
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: 'crud',
    port: 3307
})
db.connect((err) => {
    if (err) {
        console.log("เกิดข้อผิดพลาดในการเชื่อมต่อกับฐานข้อมูล MySQL: ", err);
        return;
    }
    console.log("เชื่อมต่อ MySQL เรียบร้อยแล้ว!");
});


//เพิ่มข้อมูลนักเรียน
app.post('/api/create', (req, res) => {
    const { Name, Email } = req.body;
    const sql = 'INSERT INTO student (Name, Email) VALUES (?,?)';
    db.query(sql, [Name, Email], (err, result) => {
        if (err) {
            res.status(500).json({ error: 'เกิดข้อผิดพลาดในการเพื่มข้อมูล' });
            return;
        }
        res.status(201).json({ message: 'เพิ่มข้อมูลเรียบร้อยแล้ว'});
    });
});

//ดึงข้อมูลนักเรียนทั้งหมด
app.get('/api/student', (req, res) => {
    const sql = 'SELECT * FROM student';    
    db.query(sql, (err, results) => {
        if (err) {
            res.status(500).json({ error: 'เกิดข้อผิดพลาดในการดึงข้อมูลทั้งหมด' });
            return;
        }
        res.json(results);
    });
});

//ดึงข้อมูลนักเรียนตาม id
app.get('/api/student/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM student WHERE ID = ?';
    db.query(sql, id, (err, result) => {
        if (err) {
            res.status(404).json({ message: 'ไม่พบข้อมูลนักเรียนกับ id ที่ระบุ' });
            return;
        }
        res.json(result[0]);
    });
});

//อัพเดตข้อมูลนักเรียนตาม id
app.put('/api/update/:id', (req, res) => {
    const { id } = req.params;
    const { Name, Email } = req.body;
    const sql = 'UPDATE student SET Name = ?, Email = ? WHERE ID=?';
    db.query(sql, [Name, Email, ID], (err, result) => {
        if (err) {
            res.status(500).json({ error: 'เกิดข้อผิดพลาดในการอัพเดตข้อมูลนักเรียนตาม id' });
            return;
        }
        res.json({ message: 'อัปเดตข้อมูลเรียบร้อยแล้ว' });
    });
});

//ลบข้อมูลนักเรียนตาม id
app.delete('/api/delete/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM student WHERE ID = ?';
    db.query(sql, id, (err, result) => {
        if (err) {
            res.status(500).json({ err: 'เกิดข้อผิดพลาดในการลบข้อมูลนักเรียนตาม id' });
            return;
        }
        res.json({ message: 'ลบข้อมูลเรียบร้อยแล้ว' });
    });
});

//เริ่มเซิร์ฟเวอร์
app.listen(port, () => {
    console.log(`เซิร์ฟเวอร์กำลังทำงานบนพอร์ต : ${port}`);
});
